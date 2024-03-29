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
const PreparationTime = 1000 * 60;      // コード交換時間1分
const swapTime = 1000 * 60 * 10;     // コード定期交換時間10分
const gameTime = 1000 * 60 * 60;    // ゲーム終了時間1時間
const hokanCodeTime = 1000 * 60 * 1;   // コード保管1分
let question = []; // 課題情報
let clearFlag = 0;
let queClear = 0; // 課題クリア数
let codeQueData = []; // クリア済課題・コード情報
let kadai = 0;


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
        // console.log(que);
        question.push(que);
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
    io.of("/play").to(socket.id).emit('server_to_client_member', users);
    io.of("/play").to(socket.id).emit('server_to_client_template', temps);
    socket.broadcast.emit('server_to_broadcast_join', users[number]);
    number++;

    // 課題送信
    function queSend(socketId) {
        io.of("/play").to(socketId).emit('server_to_client_question', question[kadai]);
        kadai++;
    }

    // クライアントからのイベントによる処理
    // start処理
    socket.on('client_to_server_start', () => {
        for (let i = 0; i < users.length; i++) {
            queSend(users[i].socketId);
        }
        io.of("/play").emit("server_to_everybody_start");

        // 10分おきの交換定期タイマー 
        setInterval(function () {
            io.of("/play").emit("server_to_everybody_swapTime");
        }, swapTime);

        // 1分おきのコード保管タイマー
        setInterval(function () {
            io.of("/play").emit("server_to_everybody_codehokan");
        }, hokanCodeTime);

        // ゲーム終了タイマーセット
        setTimeout(function () {
            io.of("/play").emit("server_to_everybody_end"); // ゲーム終了通知

            // DB格納処理
            const d = new Date();
            const date = d.getFullYear() + "/" + (d.getMonth() + 1) + "/" + d.getDate();
            let team = users[0].name;
            for (let i = 1; i < users.length; i++) {
                team = team + "-" + users[i].name;
            }
            const q = "insert into ranking(date,team,score) values('" + date + "','" + team + "','" + queClear + "')";
            pool.query(q, (err, results, fields) => {
                if (err) throw err;

                // console.log(results);
            });
        }, gameTime);
    });

    // 実験用コード保管処理
    function codeHokan(data, clear) {
        const q = "insert into jikken3_2(name,code,clear) values('" + data.name + "','" + data.code + "','" + clear + "')";
        pool.query(q, (err) => {
            if (err) throw err;
        });
    }

    // コード保管受信
    socket.on("client_to_server_hokancode", function (data) {
        // codeHokan(data, 0);
    });

    // 課題クリア受信
    socket.on('client_to_server_clear', function (data) {
        queClear++; // 課題クリア数カウント
        codeQueData.push(data); // クリアデータ保管
        // codeHokan(data, 1);
        if (queClear == 9) {
            // 先に課題解ききった人用になにか送る？
            io.of("/play").to(data.socketId).emit("server_to_client_wait", "2人合わせて9問目まで解き終わりました。今、ペアが最後の10問めを解いているので、解き終わるまでお待ちください。ただし、交換処理は行われます。");
        } else if (queClear == 10) {
            io.of("/play").emit("server_to_everybody_end"); // ゲーム終了通知
        } else {
            queSend(data.socketId);
        }
        // queSend(data.socketId); // 消す？

        io.of("/play").to(data.socketId).emit("server_to_client_clear");
        io.of("/play").emit('server_to_everybody_clear', data);
        if (clearFlag != 1) {
            clearFlag = 1;
            socket.broadcast.emit('server_to_broadcast_clearName', data.name + "さんが課題をクリアしました。1分後にswap処理します。");
            io.of("/play").emit('server_to_everybody_preparationTime');

            // コード交換のタイムインターバル処理
            setTimeout(function () {
                io.of("/play").emit('server_to_everybody_swapTime');
                clearFlag = 0;
            }, PreparationTime);
        } else {
            socket.broadcast.emit('server_to_broadcast_clearName', data.name + "さんが課題をクリアしました。");
        }
    });

    // swap用コード・課題受信
    socket.on("client_to_server_swapData", function (data) {
        let toId = data.myData.id + 1;
        if (toId > socket.client.conn.server.clientsCount) {
            toId = 1;
        };
        io.of("/play").to(users[toId - 1].socketId).emit("server_to_client_swap", data);
    });

    // 最終コード回収
    socket.on("client_to_server_lastCode", function (data) {
        codeQueData.push(data);
    });
});

// result.htmlでのsocket接続処理
io.of("/end").on('connection', function (socket) {
    let ranking = [];
    pool.query("select date,team,score from ranking order by score desc", (err, results) => {
        if (err) throw err;

        results.forEach(function (value) {
            const rows = {
                date: value.date,
                team: value.team,
                score: value.score
            }
            ranking.push(rows);
        });

        const sendResultData = {
            codeQueData: codeQueData,
            ranking: ranking
        }
        // console.log(ranking[0]);

        io.of("/end").to(socket.id).emit('result', sendResultData);
    });

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