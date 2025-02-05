const express = require('express');
const User = require('../models/users');

const router = express.Router();

router.post('/signup', async (req, res) => {
    try {
        const { username, firstname, lastname, password } = req.body;

        const existingUser = await User.findOne({ username });

        if (existingUser) {
            return res.status(409).json({ message: "Username or email already exists." });
        }

        const newUser = new User({ username, firstname, lastname, password });
        await newUser.save();

        res.status(201).json({ message: "User created successfully.", user_id: newUser._id });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

router.post('/login', async (req, res) => {
    try {
        const { username, password } = req.body;

        const user = await User.findOne({ username });

        if (!user) {
            return res.status(404).json({ message: "User not found." });
        }

        user.comparePassword(password, (err, isMatch) => {
            if (err)
                throw err;
            
            if (isMatch) {
                return res.status(200).json({ username: user.username, message: "User logged in successfully" });
            } else {
                return res.status(401).json({ message: "Invalid username and password" });
            }
        });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

module.exports = router;