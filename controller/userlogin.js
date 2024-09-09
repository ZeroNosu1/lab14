const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const Userlogin = require('../models/userlogin');

// กำหนด secret key สำหรับการเข้ารหัส
const JWT_SECRET = 'your_jwt_secret_key'; // เปลี่ยนเป็น secret key ที่ปลอดภัย
const JWT_REFRESH_SECRET = 'your_jwt_refresh_secret_key'; // เปลี่ยนเป็น secret key ที่ปลอดภัย

// Register
exports.register = async (req, res) => {
    const { user_name, password } = req.body;

    // ตรวจสอบค่าที่จำเป็น
    if (!user_name || !password) {
        return res.status(400).json({ message: 'Username and password are required' });
    }

    if (password.length < 6) {
        return res.status(400).json({ message: 'Password must be at least 6 characters long' });
    }

    try {
        // ตรวจสอบว่าชื่อผู้ใช้มีอยู่แล้วในฐานข้อมูลหรือไม่
        const existingUser = await Userlogin.findOne({ user_name });
        if (existingUser) {
            return res.status(400).json({ message: 'Username already exists. Please choose a different username.' });
        }

        // เข้ารหัสรหัสผ่าน
        const hashedPassword = await bcrypt.hash(password, 10);
        // สร้างผู้ใช้ใหม่
        const userlogin = new Userlogin({ user_name, password: hashedPassword });
        await userlogin.save();

        return res.status(201).json({ message: "User registered successfully" });
    } catch (err) {
        // จัดการข้อผิดพลาดอื่น ๆ ที่อาจเกิดขึ้น
        return res.status(400).json({ message: err.message });
    }
};

// Login
exports.login = async (req, res) => {
    const { user_name, password } = req.body;

    // ตรวจสอบว่าข้อมูลที่จำเป็นถูกส่งมาหรือไม่
    if (!user_name || !password) {
        return res.status(400).json({ message: 'Username and password are required' });
    }

    try {
        // ค้นหาผู้ใช้จากชื่อผู้ใช้
        const userlogin = await Userlogin.findOne({ user_name });
        if (!userlogin) {
            return res.status(400).json({ message: 'User not found' });
        }

        // เปรียบเทียบรหัสผ่านที่ผู้ใช้กรอกกับรหัสผ่านที่เก็บในฐานข้อมูล
        const isMatch = await bcrypt.compare(password, userlogin.password);
        if (!isMatch) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }

        // สร้างโทเคน
        const accessToken = jwt.sign({ user_id: userlogin._id, user_name: userlogin.user_name }, JWT_SECRET, { expiresIn: '15m' });
        const refreshToken = jwt.sign({ user_id: userlogin._id }, JWT_REFRESH_SECRET, { expiresIn: '7d' });

        // ส่งโทเคนกลับไปยังผู้ใช้
        return res.status(200).json({
            message: 'Login successful',
            accessToken,
            refreshToken
        });
    } catch (err) {
        return res.status(500).json({ message: 'An error occurred during login. Please try again later.' });
    }
};
