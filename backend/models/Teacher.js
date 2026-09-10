const mongoose = require('mongoose');

const teacherSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    employeeId: { type: String, required: true, unique: true, trim: true },
    email: { type: String, required: true, unique: true, trim: true, lowercase: true },
    phone: { type: String, default: '' },
    department: { type: String, required: true },
    designation: { type: String, default: '' },
    specialization: { type: String, default: '' },
    status: { type: String, default: 'Active' }, // Active | Inactive
    students: { type: Number, default: 0 }, // count of assigned students (kept in sync)
    projects: { type: Number, default: 0 }
  },
  { timestamps: true }
);

module.exports = mongoose.model('Teacher', teacherSchema);
