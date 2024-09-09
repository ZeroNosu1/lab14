const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path'); // เพิ่มการนำเข้า path

// โหลด environment variables จากไฟล์ .env
dotenv.config();

const app = express();

// ใช้ middleware เพื่อจัดการ JSON payload
app.use(express.json());

// ให้ Express ให้บริการไฟล์ static จากโฟลเดอร์ 'public'
app.use(express.static(path.join(__dirname, 'public')));

// ฟังก์ชันสำหรับเชื่อมต่อกับ MongoDB
const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log("Database connected successfully");
    } catch (err) {
        console.error('Database connection error:', err.message);
        process.exit(1); // หยุดการทำงานของเซิร์ฟเวอร์ถ้าเชื่อมต่อ DB ไม่ได้
    }
};

// เรียกฟังก์ชันเชื่อมต่อฐานข้อมูล
connectDB();

// กำหนดเส้นทางสำหรับการเข้าถึงหน้า login.html
app.get('/login', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'login.html'));
});

// กำหนด route สำหรับ user
const userRoutes = require('./routes/userlogin');
app.use('/api/', userRoutes);

// เริ่มต้นเซิร์ฟเวอร์
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
