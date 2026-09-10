const mongoose = require('mongoose');

const teamMemberSchema = new mongoose.Schema(
  {
    student: { type: mongoose.Schema.Types.ObjectId, ref: 'Student', required: true },
    registerNumber: { type: String, default: '' },
    role: { type: String, default: 'Team Member' },
    work: { type: String, default: '' }
  },
  { _id: false }
);

const projectSchema = new mongoose.Schema(
  {
    projectId: { type: String, required: true, unique: true, trim: true },
    projectTitle: { type: String, required: true, trim: true },
    description: { type: String, default: '' },
    department: { type: String, required: true },
    guide: { type: mongoose.Schema.Types.ObjectId, ref: 'Teacher', default: null },
    guideName: { type: String, default: '' },
    // Flat list of student ObjectIds, kept in sync with teamMembers for backward
    // compatibility with existing population/read code across the app.
    students: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Student' }],
    // Richer per-member assignment: role + work/responsibility for this project.
    teamMembers: [teamMemberSchema],
    type: { type: String, enum: ['Individual', 'Team'], default: 'Individual' },
    status: { type: String, default: 'Not Started' }, // Not Started | In Progress | Completed
    progress: { type: Number, default: 0 },
    startDate: { type: Date },
    endDate: { type: Date }
  },
  { timestamps: true }
);

module.exports = mongoose.model('Project', projectSchema);
