const express = require('express');
const mongoose = require('mongoose');
const path = require('path');

const { app, server } = require('./socket');

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

mongoose.connect(process.env.MONGODB_URI, {})
    .then(_ => server.listen(3123, () => console.log("Server ready on port 3123 with MongoDB and Socket.io.")))
    .catch(error => console.log(error));
    