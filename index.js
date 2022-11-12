const express = require("express");
const app = express();
var PORT = process.env.PORT || 3000;
const server = app.listen(PORT, () => {
    console.log("My socket server is running");
})
const io = require('socket.io')(server);
app.use(express.static('public'));

let clients = 0;
io.sockets.on('connection',
    // We are given a websocket object in our function
    function (socket) {
    clients++;
    console.log("We have clients: " + clients);

    socket.on('disconnect', function() {
        clients--;
        console.log("We have clients: " + clients);
    });
})