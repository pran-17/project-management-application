const mongoose = require('mongoose');

const projectPhaseSchema = new mongoose.Schema(
  {
    phaseNumber: { type: Number, required: true, min: 1 },
    phaseName: { type: String, required: true, trim: true },
    description: { type: String, default: '' },
    department: { type: String, required: true, trim: true },
    startDate: { type: Date, required: true },
    endDate: { type: Date, required: true },
    status: {
      type: String,
      enum: ['Active', 'Inactive', 'Completed', 'Upcoming'],
      default: 'Upcoming'
    },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null }
  },
  { timestamps: true }
);

projectPhaseSchema.index({ phaseNumber: 1, department: 1 }, { unique: true });

module.exports = mongoose.model('ProjectPhase', projectPhaseSchema);
