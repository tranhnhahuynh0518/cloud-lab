const Student = require("./models/Student");
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Kết nối MongoDB Atlas
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('Successfully connected to MongoDB Atlas!'))
  .catch((err) => console.error('MongoDB connection error:', err));

// API kiểm tra Backend
app.get('/api/hello', (req, res) => {
  res.json({ message: 'Backend is running successfully!' });
});


// CÂU 36: GET - Lấy danh sách sinh viên
app.get("/api/students", async (req, res) => {
    try {
        const students = await Student.find();

        res.json(students);
    } catch (error) {
        res.status(500).json({
            message: "Lỗi khi lấy danh sách sinh viên",
            error: error.message
        });
    }
});


// CÂU 37: POST - Thêm sinh viên
app.post("/api/students", async (req, res) => {
    try {
        const student = await Student.create(req.body);

        res.status(201).json(student);
    } catch (error) {
        res.status(500).json({
            message: "Lỗi khi thêm sinh viên",
            error: error.message
        });
    }
});


// CÂU 38: PUT - Cập nhật sinh viên
app.put("/api/students/:id", async (req, res) => {
    try {
        const student = await Student.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true }
        );

        if (!student) {
            return res.status(404).json({
                message: "Không tìm thấy sinh viên"
            });
        }

        res.json(student);
    } catch (error) {
        res.status(500).json({
            message: "Lỗi khi cập nhật sinh viên",
            error: error.message
        });
    }
});


// CÂU 39: DELETE - Xóa sinh viên
app.delete("/api/students/:id", async (req, res) => {
    try {
        const student = await Student.findByIdAndDelete(
            req.params.id
        );

        if (!student) {
            return res.status(404).json({
                message: "Không tìm thấy sinh viên"
            });
        }

        res.json({
            message: "Xóa sinh viên thành công",
            student: student
        });
    } catch (error) {
        res.status(500).json({
            message: "Lỗi khi xóa sinh viên",
            error: error.message
        });
    }
});


// Khởi động Server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});