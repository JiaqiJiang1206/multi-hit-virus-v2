const express = require("express");
const app = express();
var PORT = process.env.PORT || 3000;
const server = app.listen(PORT, () => {
    console.log("My socket server is running");
})
const io = require('socket.io')(server);
let idList = [];

app.use(express.static('public'));

let clients = 0;
io.sockets.on('connection',
    // We are given a websocket object in our function
    function (socket) {
    clients++;
    let id = socket.id;
    idList.push(id);
    console.log(idList);
    // console.log(id);
    console.log("We have clients: " + clients);

    for(let i = 0; i < idList.length; i++){
        // if(i===0){
        io.sockets.to(idList[i]).emit('clientState',i);//1为第一个客户端，0为其他客户端
        // }else{
        //     io.sockets.to(idList[i]).emit('clientState',0);//1为第一个客户端，0为其他客户端
        // }
    }

    socket.on('disconnect', function() {
        let idDisconnect = socket.id;
        for(let i = 0; i < idList.length; i++){
            if(idList[i] === idDisconnect){
                idList.splice(i, 1);
                console.log(idList);
            }
        }
        clients--;
        console.log("We have clients: " + clients);
        for(let i = 0; i < idList.length; i++){
            // if(i===0){
            io.sockets.to(idList[i]).emit('clientState',i);//1为第一个客户端，0为其他客户端
            // }else{
            //     io.sockets.to(idList[i]).emit('clientState',0);//1为第一个客户端，0为其他客户端
            // }
        }

    });
        // 只向 id = socketId 的这一连接发送消息
    // io.sockets.to(id).emit('sendMassege','hhhhhhh');

    socket.on('addBullet1', function(a){
        io.sockets.to(idList[0]).emit('addBullet10',a);
    })
    socket.on('addBullet2', function(a){
        io.sockets.to(idList[0]).emit('addBullet20',a);
    })
    socket.on('addBullet3', function(a){
        io.sockets.to(idList[0]).emit('addBullet30',a);
    })

    socket.on('reduceBullet1', function(a){
        io.sockets.to(idList[1]).emit('reduceBullet01',a);
    })
})