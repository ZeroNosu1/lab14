// routes/userlogin.js

const express = require('express');
const router = express.Router();
const { register, login } = require("../controller/userlogin");
const authenticateSession = require('../middlewares/auth'); // ตรวจสอบ path ให้ถูกต้อง

// Route for registration
router.post("/register", register);

// Route for login
router.post("/login", login);

// Protected route example
router.get("/protected", authenticateSession, (req, res) => {
    res.send('This is a protected route');
});

// Default route to handle undefined paths
router.use((req, res) => {
    res.status(404).json({ message: "Route not found" });
});

module.exports = router;
