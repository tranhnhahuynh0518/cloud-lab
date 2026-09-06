const mongoose = require('mongoose');

const studentSchema = new mongoose.Schema({
    studentId: {
        type: String,
        required: true,
        unique: true
    },
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    }
});

// Đây là lệnh cực kỳ quan trọng để tạo ra hàm .find()
module.exports = mongoose.model('Student', studentSchema);