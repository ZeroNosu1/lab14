const User = require('../models/user'); // Import User model

// Helper function to parse and validate request data
const parseUserData = (data) => {
    const parsedData = { ...data };

    // Process work_start_time
    if (data.work_start_time) {
        const date = new Date(data.work_start_time);
        if (!isNaN(date.getTime())) {
            parsedData.work_start_time = date.toISOString(); // Convert to ISO string
        } else {
            throw new Error('Invalid date format for work_start_time');
        }
    }

    // Process no_time_entry_dates
    if (data.no_time_entry_dates) {
        try {
            if (typeof data.no_time_entry_dates === 'string') {
                // If it's a string, try parsing it as JSON
                const parsedArray = JSON.parse(data.no_time_entry_dates);
                if (Array.isArray(parsedArray)) {
                    parsedData.no_time_entry_dates = parsedArray.map(dateStr => {
                        const date = new Date(dateStr);
                        if (!isNaN(date.getTime())) {
                            return date.toISOString();
                        } else {
                            throw new Error(`Invalid date format in no_time_entry_dates: ${dateStr}`);
                        }
                    });
                } else {
                    throw new Error('no_time_entry_dates JSON string does not represent an array');
                }
            } else if (Array.isArray(data.no_time_entry_dates)) {
                // If it's already an array, validate each item
                parsedData.no_time_entry_dates = data.no_time_entry_dates.map(dateStr => {
                    const date = new Date(dateStr);
                    if (!isNaN(date.getTime())) {
                        return date.toISOString();
                    } else {
                        throw new Error(`Invalid date format in no_time_entry_dates: ${dateStr}`);
                    }
                });
            } else {
                throw new Error('no_time_entry_dates is neither a valid JSON string nor an array');
            }
        } catch (e) {
            throw new Error(`Invalid format for no_time_entry_dates: ${e.message}`);
        }
    }

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
