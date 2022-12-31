const path = require('path');
const bodyParser = require('body-parser');
const express = require('express');
const app = express();
const server = require('http').createServer(app);
const io = require('socket.io')(server);
const ip = require('ip');
const hostname = ip.address(); // hostname指定
const port = 3000;

let number = 0; // カウンター
let users = []; // ユーザ情報保存配列
let code_results = []; // 最終ユーザのデータ
const timeInterval = 1000 * 60;          // コード交換時間1分
const timeLimit = 1000 * 60 * 60;    // ゲーム終了時間1時間
let question = []; // 課題情報
let queNum = 0;
let problem_clear = 0; // 課題クリア数
const langNum = 14; // 言語数

// database接続準備処理
const mysql = require('mysql');
const { createConnection } = require('net');
const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'webwebapp',
    database: 'questions'
});
// 全課題取得→変数に格納
connection.connect();
connection.query('SELECT * FROM question natural join testcase natural join answerpattern', function (error, response) {
    if (error) throw error;

    response.forEach(function (value) {
        const que = {
            task: value.task,
            testNum: value.testnum,
            input: [value.test1, value.test2, value.test3, value.test4, value.test5, value.test6, value.test7, value.test8],
            answer: [value.answer1, value.answer2, value.answer3, value.answer4, value.answer5, value.answer6, value.answer7, value.answer8]
        }
        // console.log(que);
        question.push(que);
        queNum++;
    });
});

// code.htmlでのsocket接続処理
io.of("/play").on('connection', function (socket) {
    users[number].id = number + 1;
    users[number].socketId = socket.id;
    users[number].end = 0;
    io.of("/play").to(socket.id).emit('server_to_client_member', users);
    socket.broadcast.emit('server_to_broadcast_join', users[number]);
    number++;

    function queSend(socketId){
        io.of("/play").to(socketId).emit('server_to_client_question', question[Math.floor(Math.random() * queNum)]);
    }

    // クライアントからのイベントによる処理
    // start処理
    socket.on('client_to_server_start', () => {
        users.forEach(function (data) {
            queSend(data.socketId);
        });
        io.of("/play").emit("server_to_everybody_start");

        // ゲーム終了タイマーセット
        setTimeout(function () {
            io.of("/play").emit("server_to_everybody_end"); // ゲーム終了通知
        }, timeLimit);
    });

    // 課題クリア受信
    socket.on('client_to_server_clear', function (data) {
        queSend(data.socketId);
        io.of("/play").to(data.socketId).emit("server_to_client_clear", Math.floor(Math.random() * langNum));
        socket.broadcast.emit('server_to_broadcast_clear', data.name);
        io.of("/play").emit('server_to_everybody_preparationTime');

        // コード交換のタイムインターバル処理
        setInterval(function () {
            io.of("/play").emit('server_to_everybody_swapTime');
        }, timeInterval);

    });

    // 課題・コード交換処理
    socket.on("client_to_server_swapData", function (data) {
        let toId = data.myData.id + 1;
        if (toId > socket.client.conn.server.clientsCount) {
            toId = 1;
        };
        io.of("/play").to(users[toId - 1].socketId).emit("server_to_client_swap", data);
    });

    //自主的ゲーム終了ボタンイベント
    /*socket.on("client_to_server_end", function (data) {
        users[data - 1].end = 1;
        let i = 0;
        while (i < socket.client.conn.server.clientsCount) {
            if (users[i].end != 1) {
                break;
            }
            i++;
        }
        if (i == socket.client.conn.server.clientsCount) {
            io.of("/play").emit("server_to_client_end");
        }
    });*/

    // 最終コード回収
    socket.on("client_to_server_result", function (data) {
        code_results.push(data);
    });
});

// result.htmlでのsocket接続処理
io.of("/end").on('connection', function (socket) {
    io.of("/end").to(socket.id).emit('result', code_results);
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
    console.log("access below")
    console.log('http://' + hostname + ':' + port);
});
connection.end();