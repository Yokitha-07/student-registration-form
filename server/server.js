// server/server.js
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const multer = require("multer");
const bodyParser = require("body-parser");
const path = require("path");


const app = express();
app.use(cors());
app.use(bodyParser.json());
app.use('/uploads', express.static('uploads'));


mongoose.connect("mongodb://127.0.0.1:27017/studentDB")
    .then(() => console.log("MongoDB Connected"))
    .catch((err) => console.log(err));

    // Multer config
const storage = multer.diskStorage({
    destination: (req, file, cb) => cb(null, "uploads/"),
    filename: (req, file, cb) => cb(null, Date.now() + "-" +
file.originalname),
});
const upload = multer({ storage });

// Mongoose Schema
const studentSchema = new mongoose.Schema({
    name: String,
    email: String,
    phone: String,
    ageGroup: String,
    gender: String,
    courses: [String],
    qualification: String,
    learningMode: String,
    comments: String,
    document: String
});
const Student = mongoose.model("Student", studentSchema);

// POST route to handle form
app.post("/register", upload.single("document"), async (req, res) => {
    try {
        const {
            name, email, phone, ageGroup, gender,
            qualification, learningMode, comments
        } = req.body;
        const courses = req.body["courses[]"] || req.body.courses;
        const documentPath = req.file ? req.file.path : "";

        const student = new Student({
            name, email, phone, ageGroup, gender,
            courses: Array.isArray(courses) ? courses : [courses],
            qualification, learningMode, comments,
            document: documentPath
        });

        await student.save();
        res.status(201).json({ message: "Student Registered Successfully" });
        } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Error registering student" });
    }
});

app.listen(5000, () => {
    console.log("Server running on port 5000");
});