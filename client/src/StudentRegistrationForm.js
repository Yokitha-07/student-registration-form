import React, { useState } from "react";
import axios from "axios";

function StudentRegistrationForm() {
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        phone: "",
        ageGroup: "",
        gender: "",
        courses: [],
        qualification: "",
        learningMode: "",
        comments: "",
    });
    const [file, setFile] = useState(null);

    const handleChange = (e) => {
        const { name, value, type } = e.target;
        if (type === "checkbox") {
            const updatedCourses = [...formData.courses];
            if (e.target.checked) {
                updatedCourses.push(value);
            } else {
                const index = updatedCourses.indexOf(value);
                if (index !== -1) updatedCourses.splice(index, 1);
            }
            setFormData({ ...formData, courses: updatedCourses });
        } else {
            setFormData({ ...formData, [name]: value });
        }
    };

    const handleFileChange = (e) => {
        setFile(e.target.files[0]);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const submitData = new FormData();
    
        for (const key in formData) {
            if (Array.isArray(formData[key])) {
                formData[key].forEach((item) => submitData.append(`${key}[]`, item));
            } else {
                submitData.append(key, formData[key]);
        }
    }

    if (file) {
        submitData.append("document", file);
    }
    try {
        await axios.post("http://localhost:5000/register", submitData, {
            headers: { "Content-Type": "multipart/form-data" },
        });
        alert("Student Registered Successfully!");
    } catch (error) {
        console.error(error);
        alert("Failed to register student.");
        }
    };

    return (
        <form onSubmit={handleSubmit} className="form-container">
            <h2>Student Registration</h2>
            <input type="text" name="name" placeholder="Full Name" onChange={handleChange} required />
            <input type="email" name="email" placeholder="Email Address" onChange={handleChange} required />
            <input type="text" name="phone" placeholder="Phone Number" onChange={handleChange} required />

            <select name="ageGroup" onChange={handleChange} required>
                <option value="">Select Age Group</option>
                <option value="Under 18">Under 18</option>
                <option value="18 to 25">18 to 25</option>
                <option value="26 to 35">26 to 35</option>
                <option value="36+">36+</option>
            </select>

            <label>Gender:</label>
            <label><input type="radio" name="gender" value="Male" onChange={handleChange} /> Male</label>
            <label><input type="radio" name="gender" value="Female" onChange={handleChange} /> Female</label>
            <label><input type="radio" name="gender" value="Other" onChange={handleChange} /> Other</label>

            <label>Courses Interested:</label>
            <label><input type="checkbox" name="courses" value="Web Development" onChange={handleChange} /> Web Development</label>
            <label><input type="checkbox" name="courses" value="AI & ML" onChange={handleChange} /> AI & ML</label>
            <label><input type="checkbox" name="courses" value="DevOps" onChange={handleChange} /> DevOps</label>

            <select name="qualification" onChange={handleChange} required>
                <option value="">Select Qualification</option>
                <option value="A/L">A/L</option>
                <option value="Diploma">Diploma</option>
                <option value="Undergraduate">Undergraduate</option>
                <option value="Graduate">Graduate</option>
            </select>

            <select name="learningMode" onChange={handleChange} required>
                <option value="">Learning Mode</option>
                <option value="Online">Online</option>
                <option value="Physical">Physical</option>
                <option value="Hybrid">Hybrid</option>
            </select>

            <textarea name="comments" placeholder="Additional Comments" onChange={handleChange}></textarea>

            <label>Upload CV/Certificate:</label>
            <input type="file" name="document" onChange={handleFileChange} accept=".pdf,.doc,.jpg,.png" />

            <button type="submit">Submit</button>
        </form>
    );
}

export default StudentRegistrationForm;  