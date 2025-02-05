const socketio = require('socket.io');
const express = require('express');
const http = require('http');

const app = express();
const server = http.createServer(app);
const io = socketio(server);

io.on('connection', (socket) => {
    console.log('New WebSocket connection');

    socket.on('joinRoom', ({ username, room }) => {
        socket.join(room);

        socket.broadcast.to(room).emit('message', { from_user: 'Admin', room: room, message: `${username} has joined the chat room!` });
    });

    socket.on('leaveRoom', ({ username, room }) => {
        socket.leave(room);

        socket.broadcast.to(room).emit('message', { from_user: 'Admin', room: room, message: `${username} has left the chat room!` });
    });
});

module.exports = { app, server, io };