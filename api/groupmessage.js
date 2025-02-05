const express = require('express');
const GroupMessage = require('../models/groupmessage');
const { io } = require('./socket');

const router = express.Router();

router.get('/:room', async (req, res) => {
    try {
        const messages = await GroupMessage.find({ room: req.params.room });
        res.status(200).json({ data: messages });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

router.post('/', async (req, res) => {
    try {
        const newMessage = new GroupMessage(req.body);
        await newMessage.save();

        io.to(newMessage.room).emit('message', newMessage);

        res.status(201).json({ data: newMessage });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

router.put('/:room/:id', async (req, res) => {
    try {
        const updatedMessage = await GroupMessage.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!updatedMessage)
            return res.status(404).json({ message: 'Group message not found.' });

        io.to(newMessage.room).emit('updateMessage', updatedMessage);

        res.status(200).json({ data: updatedMessage });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

router.delete('/:room/:id', async (req, res) => {
    try {
        const deletedMessage = await GroupMessage.findByIdAndDelete(req.query.id);
        if (!deletedMessage)
            return res.status(404).json({ message: 'Group message not found.' });

        io.to(newMessage.room).emit('deleteMessage', deletedMessage);

        res.status(204).end();
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

module.exports = router;