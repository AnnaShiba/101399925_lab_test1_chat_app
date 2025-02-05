const express = require('express');
const mongoose = require('mongoose');
const http = require('http');
const socketio = require('socket.io');
const path = require('path');

const app = express();
const server = http.createServer(app);
const io = socketio(server);

const userRoutes = require('./users');
const groupRoutes = require('./groupmessage');
const privateRoutes = require('./privatemessage');

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use('/api/user', userRoutes);
app.use('/api/group', groupRoutes);
app.use('/api/private', privateRoutes);

app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, '../public', 'index.html'));
});

app.get("/:filename", (req, res) => {
    res.sendFile(path.join(__dirname, '../public', req.params.filename));
});

io.on('connection', (socket) => {
    console.log('New WebSocket connection');
    socket.emit('message', 'Hello World!');
});

mongoose.connect(process.env.MONGODB_URI, {})
    .then(_ => server.listen(3123, () => console.log("Server ready on port 3123 with MongoDB and Socket.io.")))
    .catch(error => console.log(error));
    