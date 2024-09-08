const express = require('express');
const router = express.Router();

const { register, login } = require("../controller/userlogin");

// Route for registration
router.post("/register", register);

// Route for login
router.post("/login", login);

// Default route to handle undefined paths
router.use((req, res) => {
    res.status(404).json({ message: "Route not found" });
});

module.exports = router;
