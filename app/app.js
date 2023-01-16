const path = require('path');
const bodyParser = require('body-parser');
const express = require('express');
const app = express();
const server = require('http').createServer(app);
const io = require('socket.io')(server);
const fs = require('fs');
const ip = require('ip');
const hostname = ip.address(); // hostname指定
const port = 3000;

let number = 0; // カウンター
let users = []; // ユーザ情報保存配列
const gameTime = 1000 * 60 * 1;    // ゲーム終了時間1時間
const hokanCodeTime = 1000 * 60 * 5;   // コード保管1分
let question = []; // 課題情報
let codeQueData = [];
let queNum = 0;
let swapData = [];
const langNum = 14; // 言語数


// database接続準備処理
const mysql = require('mysql');
const pool = mysql.createPool({
    connectionLimit: 1,
    host: 'localhost',
    user: 'root',
    password: 'webwebapp',
    database: 'questions',
    dateStrings: 'date'
});
pool.query('SELECT * FROM question natural join testcase natural join answer', function (err, results) {
    if (err) throw err;

    results.forEach(function (value) {
        const que = {
            task: value.task,
            testNum: value.testnum,
            input: [value.test1, value.test2, value.test3, value.test4, value.test5, value.test6, value.test7, value.test8],
            answer: [value.answer1, value.answer2, value.answer3, value.answer4, value.answer5, value.answer6, value.answer7, value.answer8]
        }
        console.log(que);
        question.push(que);
        queNum++;
    });
});

// 言語別コードテンプレート取得
const lang = ["c", "cpp", "java", "go", "rust", "swift", "objective-c", "kotlin", "scala", "python", "ruby", "php", "javascript", "typescript"];
let temps = [];
for (let i = 0; i < lang.length; i++) {
    const name = "public/temp/temp_" + lang[i] + ".txt";
    temps.push(fs.readFileSync(name, 'utf8'));
}

// code.htmlでのsocket接続処理
io.of("/play").on('connection', function (socket) {
    users[number].id = number + 1;
    users[number].socketId = socket.id;
    users[number].end = 0;
    io.of("/play").to(socket.id).emit('server_to_client_member', users[number]);
    io.of("/play").to(socket.id).emit('server_to_client_template', temps);
    number++;

    // 課題送信
    function queSend(socketId, num) {
        io.of("/play").to(socketId).emit('server_to_client_question', question[12]);
    }

    // クライアントからのイベントによる処理
    // start処理
    socket.on('client_to_server_start', () => {
        for (let i = 0; i < users.length; i++) {
            queSend(users[i].socketId, users[i].kadai);
        }
        io.of("/play").emit("server_to_everybody_start");

        // 1分おきのコード保管タイマー
        setInterval(function () {
            io.of("/play").emit("server_to_everybody_codehokan");
        }, hokanCodeTime);

        // ゲーム終了タイマーセット
        setTimeout(function () {
            io.of("/play").emit("server_to_everybody_end"); // ゲーム終了通知
        }, gameTime);
    });

    function codeHokan(data, clear) {
        const q = "insert into code(clear,code,name) values('" + clear + "','" + data.code + "','" + data.name + "')";
        pool.query(q, (err) => {
            if (err) throw err;
        });
    }

    // コード保管受信
    socket.on("client_to_server_hokancode", function (data) {
        codeHokan(data, 0);
    });

    // 課題クリア受信
    socket.on('client_to_server_clear', function (data) {
        users[data.id - 1].kadai++;
        users[data.id - 1].clearData.push(data);
        codeQueData.push(data);
        codeHokan(data, 1);

        if (users[data.id - 1].kadai == 14) {
            io.of("/play").to(data.socketId).emit("server_to_single_end"); // ゲーム終了通知
        }
        queSend(data.socketId, users[data.id - 1].kadai);

        io.of("/play").to(data.socketId).emit("server_to_client_clear", data);
    });

    // 最終コード回収
    socket.on("client_to_server_lastCode", function (data) {
        codeQueData.push(data);
    });
});

// result.htmlでのsocket接続処理
io.of("/end").on('connection', function (socket) {
    io.of("/end").to(socket.id).emit('result', codeQueData);
    io.of("/end").to(socket.id).emit('server_to_client_member', users);
});

app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyParser.urlencoded({ extended: false }));       // postフォームで配列のデータを受け取らないようにしている

// ページ遷移処理、フォーム受信処理
app.get('/', function (req, res) {
    res.sendFile(__dirname + '/views/index.html');
});

app.post('/code', function (req, res) {
    let user = {};
    user.name = req.body.name;
    user.kadai = 14; // 1人用、課題認識変数
    user.clearData = [];
    users.push(user);
    res.sendFile(__dirname + '/views/code.html');
});

app.get('/result', function (req, res) {
    res.sendFile(__dirname + '/views/result.html');
});

server.listen(port, hostname, function () {
    console.log("access below");
    console.log('http://' + hostname + ':' + port);
});