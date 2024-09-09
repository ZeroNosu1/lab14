const mongoose = require('mongoose');

// Define the schema correctly
const userloginSchema = new mongoose.Schema({
    user_name: { type: String, required: true}, // เพิ่ม unique: true เพื่อป้องกันการซ้ำ
    password: { type: String, required: true },
}, 
{ timestamps: true, versionKey: false });

// Export the model with the correct schema
const Userlogin = mongoose.model('Userlogin', userloginSchema);

module.exports = Userlogin; // ส่งออกเป็น Admin
