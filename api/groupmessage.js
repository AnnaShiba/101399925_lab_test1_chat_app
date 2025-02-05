const express = require('express');
const GroupMessage = require('../models/groupmessage');

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

        res.status(204).end();
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

module.exports = router;