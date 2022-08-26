const path = require('path');
const bodyParser = require('body-parser');
const express = require('express');
const app = express();
const server = require('http').createServer(app);
const io = require('socket.io')(server);
const port = 3000;
const hostname = 'localhost'; //hostname指定

let number = 0; // カウンター
let users = [];

const timeInterval = 10000; //コード交換時間10秒(仮、今だけ)
const timeLimit = 60 * 60 * 1000;    //ゲーム終了時間1時間(仮)

let kadai = "〇を描画せよ"; //仮の課題

// socket接続確立中の処理
io.on('connection', function(socket){
    users[number].id = number + 1;
    users[number].socketId = socket.id;
    console.log(JSON.stringify(users)); // json配列に格納されているデータをログに表示
    io.to(socket.id).emit('server_to_client_member', users);
    socket.broadcast.emit('server_to_client_join', users[number]);
    number++;

    // クライアントからのイベントによる処理
    //start処理
    socket.on('client_to_server_start', () => {
        io.emit("start", kadai);
        //コード交換のタイムインターバル処理
        setInterval(function(){
            io.emit('server_to_client_timenews');
        },timeInterval);
        /*ゲーム終了タイマー,今は停止させている
        setTimeout(function(){

        },timeLimit);*/
    });

    //ユーザからコードデータを受信し、他のユーザに送信する処理
    socket.on("client_to_server_code", function(data){
        let toId = data.id + 1;
        if(toId > socket.client.conn.server.clientsCount){
            toId = 1;
        };
        io.to(users[toId-1].socketId).emit("server_to_client_exchange", data.code);
    });
});

app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyParser.urlencoded({extended: false}));       //postフォームで配列のデータを受け取らないようにしている

//ページ遷移処理、フォーム受信処理
app.get('/', function(req, res){
    res.sendFile(__dirname + '/views/index.html');
});

app.post('/code', function(req, res){
    var user = {};
    user.name = req.body.name;
    users.push(user);
    res.sendFile(__dirname + '/views/code.html');
});

server.listen(port, hostname, function(){
    console.log('listening on port %d', port);
});