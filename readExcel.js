const xlsx = require('xlsx');

// โหลดไฟล์ Excel
const workbook = xlsx.readFile('projecttest4.xlsx');


// เลือก sheet ที่ต้องการอ่าน
const sheetName = workbook.SheetNames[0]; // เลือกชื่อ sheet แรก
const worksheet = workbook.Sheets[sheetName];

// แปลงข้อมูล sheet เป็น JSON
const data = xlsx.utils.sheet_to_json   (worksheet);

console.log(data);
