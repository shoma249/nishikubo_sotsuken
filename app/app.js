const path = require('path');
const bodyParser = require('body-parser');
const express = require('express');
const app = express();
const server = require('http').createServer(app);
const io = require('socket.io')(server);
const port = 3000;
const hostname = 'localhost'; // hostname指定

let number = 0; // カウンター
let users = []; // ユーザ情報保存配列
const timeInterval = 10000;          // コード交換時間10秒(仮、今だけ)
const timeLimit = 20000;    // ゲーム終了時間1時間(仮), test20秒

// database処理
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
let result = '';
connection.query('SELECT task, result FROM test ORDER BY RAND() LIMIT 1', function (error, response) {
    if (error) throw error;

    kadai = response[0].task;    // 問題取得
    result = response[0].result; // 回答取得
    console.log(response);
});
connection.end();

// socket接続確立中の処理
io.on('connection', function (socket) {
    users[number].id = number + 1;
    users[number].socketId = socket.id;
    console.log(JSON.stringify(users)); // json配列に格納されているデータをログに表示
    io.to(socket.id).emit('server_to_client_member', users);
    socket.broadcast.emit('server_to_client_join', users[number]);
    number++;

    // クライアントからのイベントによる処理
    // start処理
    socket.on('client_to_server_start', () => {
        io.emit("start", kadai);
        // コード交換のタイムインターバル処理
        setInterval(function () {
            io.emit('server_to_client_timenews');
        }, timeInterval);
        // ゲーム終了タイマー
        setTimeout(function () {
            io.emit("server_to_client_end");
        }, timeLimit);
    });

    // ユーザからコードデータを受信し、他のユーザに送信する処理
    socket.on("client_to_server_code", function (data) {
        let toId = data.id + 1;
        if (toId > socket.client.conn.server.clientsCount) {
            toId = 1;
        };
        io.to(users[toId - 1].socketId).emit("server_to_client_exchange", data.code);
    });
});

// ゲーム終了処理
/*function gameEnd() {

}*/

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

app.get('/result', function(req, res){
    res.sendFile(__dirname + '/view/result.html');
});

server.listen(port, hostname, function () {
    console.log('listening on port %d', port);
});