const mongoose = require('mongoose');

const taskSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    description: { type: String, default: '' },
    student: { type: mongoose.Schema.Types.ObjectId, ref: 'Student', required: true },
    guide: { type: mongoose.Schema.Types.ObjectId, ref: 'Teacher', default: null },
    project: { type: mongoose.Schema.Types.ObjectId, ref: 'Project', default: null },
    phase: { type: mongoose.Schema.Types.ObjectId, ref: 'ProjectPhase', default: null },
    department: { type: String, required: true, trim: true },
    priority: { type: String, enum: ['Low', 'Medium', 'High'], default: 'Medium' },
    status: {
      type: String,
      enum: ['Pending', 'In Progress', 'Under Review', 'Completed'],
      default: 'Pending'
    },
    progress: { type: Number, default: 0, min: 0, max: 100 },
    assignedDate: { type: Date, default: Date.now },
    dueDate: { type: Date, default: null },
    studentWork: { type: String, default: '' },
    studentRemark: { type: String, default: '' },
    teacherRemark: { type: String, default: '' },
    submittedAt: { type: Date, default: null },
    reviewedAt: { type: Date, default: null }
  },
  { timestamps: true }
);

taskSchema.index({ student: 1, createdAt: -1 });
taskSchema.index({ guide: 1, createdAt: -1 });
taskSchema.index({ phase: 1 });
taskSchema.index({ department: 1 });

module.exports = mongoose.model('Task', taskSchema);
