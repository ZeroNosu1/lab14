const express = require('express');
const router = express.Router();
const userController = require('../controller/userController');

// Define routes and map them to controller functions
router.get('/users', userController.getUsers); // Get all users
router.get('/user/:id', userController.getUser); // Get a single user by ID
router.post('/postuser', userController.createUser); // Create a new user
router.put('/user/:id', userController.updateUser); // Update an existing user
router.delete('/user/:id', userController.deleteUser); // Delete a user

module.exports = router;
