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

// socket接続確立中の処理
io.on('connection', function(socket){
    let exchange = 0;
    users[number].id = number + 1;
    users[number].socketId = socket.id;
    console.log(JSON.stringify(users)); // json配列に格納されているデータをログに表示
    io.to(socket.id).emit('server_to_client_member', users);
    socket.broadcast.emit('server_to_client_join', users[number]);
    number++;

    // クライアントからのイベントによる処理
    //start処理
    socket.on('client_to_server_start', () => {
        setTimeout(function(){
            io.emit('server_to_client_timenews');
            exchange++;
        },5000);
    });

    socket.on("client_to_server_code", function(data){
        let toId = exchange + data.id;
        if(toId > socket.client.conn.server.clientsCount){
            toId = 0;
        };
        //io.to(users[toId-1].socketId).emit("server_to_client_exchange", data.code);
        if(data.id == 1){
            io.to(users[1].socketId).emit("server_to_client_exchange", data.code);
        }else{
            io.to(users[0].socketId).emit("server_to_client_exchange", data.code);
        }
    });
});

app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyParser.urlencoded({extended: false})); //postフォームで配列のデータを受け取らないようにしている

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