const User = require('../models/user'); // Import User model

// Helper function to parse and validate request data
const parseUserData = (data) => {
    const parsedData = { ...data };

    if (data.work_start_time) {
        const date = new Date(data.work_start_time);
        if (!isNaN(date.getTime())) {
            parsedData.work_start_time = date;
        } else {
            throw new Error('Invalid date format for work_start_time');
        }
    }
    if (data.no_time_entry_dates) {
        try {
            parsedData.no_time_entry_dates = JSON.stringify(data.no_time_entry_dates);
        } catch (e) {
            throw new Error('Invalid format for no_time_entry_dates');
        }
    }

    // Add more validation logic here if needed

    return parsedData;
};

// Get all users
exports.getUsers = async (req, res) => {
    try {
        const users = await User.find();
        res.status(200).json(users);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// Get a single user by ID
exports.getUser = async (req, res) => {
    try {
        const { id } = req.params;
        const user = await User.findById(id);
        if (!user) return res.status(404).json({ message: "User not found" });
        res.status(200).json(user);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// Create a new user
exports.createUser = async (req, res) => {
    try {
        const parsedData = parseUserData(req.body);
        const user = new User(parsedData);

        const newUser = await user.save();
        res.status(201).json(newUser);
    } catch (err) {
        if (err.message.includes('Invalid date format') || err.message.includes('Invalid format')) {
            res.status(422).json({ message: err.message });
        } else {
            res.status(400).json({ message: err.message });
        }
    }
};

// Update an existing user
exports.updateUser = async (req, res) => {
    try {
        const { id } = req.params;
        const parsedData = parseUserData(req.body);

        const updatedUser = await User.findByIdAndUpdate(id, { $set: parsedData }, { new: true, runValidators: true });
        if (!updatedUser) return res.status(404).json({ message: 'User not found' });

        res.status(200).json(updatedUser);
    } catch (err) {
        if (err.message.includes('Invalid date format') || err.message.includes('Invalid format')) {
            res.status(422).json({ message: err.message });
        } else {
            res.status(400).json({ message: err.message });
        }
    }
};

// Delete a user
exports.deleteUser = async (req, res) => {
    try {
        const { id } = req.params;
        const user = await User.findById(id);
        if (!user) return res.status(404).json({ message: 'User not found' });

        await User.findByIdAndDelete(id);
        res.status(200).json({ message: 'User deleted successfully' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};
