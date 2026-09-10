const mongoose = require('mongoose');

const studentSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    registerNumber: { type: String, required: true, unique: true, trim: true },
    email: { type: String, required: true, unique: true, trim: true, lowercase: true },
    phone: { type: String, default: '' },
    department: { type: String, required: true },
    year: { type: String, default: '' },
    status: { type: String, default: 'Pending' }, // Pending | Active | Assigned ...
    guide: { type: mongoose.Schema.Types.ObjectId, ref: 'Teacher', default: null },
    guideName: { type: String, default: 'Not Assigned' },
    project: { type: String, default: 'Not Assigned' }
  },
  { timestamps: true }
);

module.exports = mongoose.model('Student', studentSchema);
