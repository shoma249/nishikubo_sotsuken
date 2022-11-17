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
let end_c = 0;
let wait_c = 0;
let users = []; // ユーザ情報保存配列
let code_results = []; // 最終ユーザのデータ
const timeInterval = 10000;          // コード交換時間20分(仮、今だけ10秒)
const timeLimit = 1000 * 60 * 60;    // ゲーム終了時間1時間

// database接続処理
const mysql = require('mysql');
const { createConnection } = require('net');

const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'webwebapp',
    database: 'questions'
});
connection.connect();

// 問題と回答取得
let kadai = '';
let answer = '';
connection.query('SELECT task, result FROM test ORDER BY RAND() LIMIT 1', function (error, response) {
    if (error) throw error;

    kadai = response[0].task;    // 問題取得
    answer = response[0].result; // 回答取得
    console.log(kadai);
});
connection.end();

// ゲームプレイ中のsocket接続処理
io.of("/play").on('connection', function (socket) {
    users[number].id = number + 1;
    users[number].socketId = socket.id;
    io.of("/play").to(socket.id).emit('server_to_client_member', users);
    socket.broadcast.emit('server_to_client_join', users[number]);
    number++;

    // クライアントからのイベントによる処理
    // start処理
    socket.on('client_to_server_start', () => {
        io.of("/play").emit("start", kadai);
        // コード交換のタイムインターバル処理
        setInterval(function () {
            io.of("/play").emit('server_to_client_timenews');
        }, timeInterval);

        // ゲーム終了タイマーセット
        setTimeout(function () {
            io.of("/play").emit("server_to_client_end"); // ゲーム終了通知
        }, timeLimit);
    });

    // ユーザからコードデータを受信し、他のユーザに送信する処理
    socket.on("client_to_server_code", function (data) {
        let toId = data.id + 1;
        if (toId > socket.client.conn.server.clientsCount) {
            toId = 1;
        };
        io.of("/play").to(users[toId - 1].socketId).emit("server_to_client_exchange", data);
    });

    //自主的ゲーム終了ボタンイベント
    socket.on("client_to_server_end", () => {
        end_c++;
        if (end_c == users.length) {
            io.of("/play").emit("server_to_client_end");
        }
    });

    socket.on("client_to_server_result", function (data) {
        code_results.push(data);
    });
});

// ゲーム終了時のリザルトページでのsocket接続処理
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
    var user = {};
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