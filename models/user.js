const mongoose = require('mongoose');

// Define the schema correctly
const userSchema = new mongoose.Schema({
    name: { type: String, required: true }, // เพิ่มฟิลด์ชื่อ
    work_start_time: { type: Date, required: true },
    sick_leave: { type: Number, default: 0 },
    personal_leave: { type: Number, default: 0 },
    vacation_leave: { type: Number, default: 0 },
    other_leave: { type: Number, default: 0 },
    out_of_area_work: { type: Number, default: 0 },
    no_time_entry_explanation: { type: String, default: '' },
    total_work_days: { type: Number, default: 0 },
    number_of_times: { type: Number, default: 0 }, // แก้คำจาก informationlt เป็น default
    number_of_explanations: { type: Number, default: 0 },
    no_time_entry_dates: { type: [Date], default: [] } // เปลี่ยนเป็น Array ของ Date
});

// Export the model with the correct schema
const User = mongoose.model('User', userSchema);

module.exports = User;
