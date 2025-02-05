const express = require('express');
const PrivateMessage = require('../models/privatemessage');

const router = express.Router();

router.get('/', async (req, res) => {
    try {
        const messages = await PrivateMessage.find();
        res.status(200).json({ data: messages });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

router.post('/', async (req, res) => {
    try {
        const newMessage = new PrivateMessage(req.body);
        await newMessage.save();
        res.status(201).json({ data: newMessage });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

router.get('/:sender/:reciever', async (req, res) => {
    try {
        const message = await PrivateMessage.find( { from_user: req.params.sender, to_user: req.params.reciever } );
        if (!message)
            return res.status(404).json({ message: 'Group message not found.' });
        
        res.status(200).json({ data: message });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

router.put('/:id', async (req, res) => {
    try {
        const updatedMessage = await PrivateMessage.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!updatedMessage)
            return res.status(404).json({ message: 'Group message not found.' });

        res.status(200).json({ data: updatedMessage });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

router.delete('/:id', async (req, res) => {
    try {
        const deletedMessage = await PrivateMessage.findByIdAndDelete(req.query.id);
        if (!deletedMessage)
            return res.status(404).json({ message: 'Group message not found.' });

        res.status(204).end();
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

module.exports = router;