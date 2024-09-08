const express = require('express');
const bcrypt = require("bcryptjs");
const Userlogin = require("../models/userlogin");

// Register
exports.register = async (req, res) => {
    const { user_name, password } = req.body;

    // Validate input
    if (!user_name || !password) {
        return res.status(400).json({ message: 'Username and password are required' });
    }

    if (password.length < 6) {
        return res.status(400).json({ message: 'Password must be at least 6 characters long' });
    }

    try {
        const hashedPassword = await bcrypt.hash(password, 10);
        const userlogin = new Userlogin({ user_name, password: hashedPassword });
        await userlogin.save();
        return res.status(201).send("User registered");
    } catch (err) {
        return res.status(400).send({ message: err.message });
    }
};

// Login
exports.login = async (req, res) => {
    const { username, password } = req.body;

    // Validate input
    if (!username || !password) {
        return res.status(400).json({ message: 'Username and password are required' });
    }

    try {
        const userlogin = await Userlogin.findOne({ user_name: username });
        if (!userlogin) return res.status(400).json({ message: 'User not found' });

        const isMatch = await bcrypt.compare(password, userlogin.password);
        if (!isMatch) return res.status(400).json({ message: 'Invalid credentials' });

        // Successful login
        return res.status(200).send("Login successful");
    } catch (err) {
        return res.status(500).json({ message: err.message });
    }
};
