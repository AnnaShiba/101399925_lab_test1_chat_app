const express = require('express');
const GroupMessage = require('../models/groupmessage');

const router = express.Router();

router.get('/', async (req, res) => {
    try {
        const messages = await GroupMessage.find();
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

router.get('/:eid', async (req, res) => {
    try {
        const message = await GroupMessage.findById(req.params.eid);
        if (!message)
            return res.status(404).json({ message: 'Group message not found.' });
        
        res.status(200).json({ data: message });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

router.put('/:eid', async (req, res) => {
    try {
        const updatedMessage = await GroupMessage.findByIdAndUpdate(req.params.eid, req.body, { new: true });
        if (!updatedMessage)
            return res.status(404).json({ message: 'Group message not found.' });

        res.status(200).json({ data: updatedMessage });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

router.delete('/:eid', async (req, res) => {
    try {
        const deletedMessage = await GroupMessage.findByIdAndDelete(req.query.eid);
        if (!deletedMessage)
            return res.status(404).json({ message: 'Group message not found.' });

        res.status(204).end();
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

module.exports = router;