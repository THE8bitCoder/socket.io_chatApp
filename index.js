// required..
const http = require('http')
const express = require('express');
const path = require('path');
const { Server } = require('socket.io');
const { Socket } = require('dgram');
const app = express();
const server = http.createServer(app);
const io = new Server(server);
const users = {};

// socket.io connections
io.on('connection', (socket) => {
    socket.on('new-user-joined', name => {
        users[socket.id] = name;
        socket.broadcast.emit('user-joined', name);
    });

    socket.on('send', message => {
      socket.broadcast.emit('receive', {message: message, name: users[socket.id]})  
    });

    socket.on('disconnect', message => {
        socket.broadcast.emit('leave', users[socket.id]);
        delete users[socket.id];
    });
})

// http connections
app.use(express.static(path.resolve('./public')));

app.get("/", (req, res) => {
    return res.sendFile("/public/index.html");
})

// starting server
server.listen(8000, () => console.log("Server started at PORT:8000"));

