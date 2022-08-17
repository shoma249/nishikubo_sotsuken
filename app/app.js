const path = require('path');
const mysql = require('mysql');
const bodyParser = require('body-parser');
const express = require('express');
const app = express();
const server = require('http').createServer(app);
const io = require('socket.io')(server);
const port = 3000;

var number = 0; // カウンター
var users = [];

// socket接続確立中の処理
io.on('connection', function(socket){
    users[number].socketId = socket.id;
    console.log(JSON.stringify(users)); // json配列に格納されているデータをログに表示
    io.to(socket.id).emit('server_to_client_member', users);
    socket.broadcast.emit('server_to_client_join', users[number]);
    number++;

    /* クライアントからのイベントによる処理
    socket.on('client_to_server_join', function(data){
        name = data.value;
        io.emit('server_to_client_name', {value : name});
        console.log(name); //サーバー側に参加ユーザー名表示
        console.log(number);
    });*/
});

app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyParser.urlencoded({extended: false})); //postフォームで配列のデータを受け取らないようにしている

app.get('/', function(req, res){
    res.sendFile(__dirname + '/views/index.html');
});

/* 待機画面いらない？
app.post('/wait', function(req, res){
    res.sendFile(__dirname + '/views/wait.html'); //　ここでそれぞれid1.id2ごとに違うwait.htmlに遷移させる？
});*/

app.post('/code', function(req, res){
    var user = {};
    console.log(req.body.name);
    user.name = req.body.name;
    users.push(user);
    res.sendFile(__dirname + '/views/code.html');
});

server.listen(port, function(){
    console.log('listening on port %d', port);
});