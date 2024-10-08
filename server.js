const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');

// โหลด environment variables จากไฟล์ .env
dotenv.config();

const app = express();

// ใช้ middleware เพื่อจัดการ JSON payload
app.use(express.json());

// ฟังก์ชันสำหรับเชื่อมต่อกับ MongoDB
const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_DB_URI); // เปลี่ยนเป็น MONGO_DB_URI
        console.log("Database connected successfully");
    } catch (err) {
        console.error('Database connection error:', err.message);
        process.exit(1); // หยุดการทำงานของเซิร์ฟเวอร์ถ้าเชื่อมต่อ DB ไม่ได้
    }
};

// เรียกฟังก์ชันเชื่อมต่อฐานข้อมูล
connectDB();

// กำหนด route สำหรับ user
const userRoutes = require('./routes/user');
app.use('/api/', userRoutes);

// เริ่มต้นเซิร์ฟเวอร์
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
