const mongoose = require('mongoose');

const researchProjectSchema = new mongoose.Schema(
  {
    researchId: { type: String, required: true, unique: true, trim: true },
    title: { type: String, required: true, trim: true },
    description: { type: String, default: '' },
    researchArea: { type: String, default: '' },
    department: { type: String, required: true },

    principalInvestigator: { type: mongoose.Schema.Types.ObjectId, ref: 'Teacher', required: true },

    teachers: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Teacher' }],
    students: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Student' }],

    fundingAgency: { type: String, default: '' },
    budget: { type: Number, default: 0 },

    startDate: { type: Date },
    endDate: { type: Date },

    status: { type: String, default: 'Pending' }, // Pending | Ongoing | Completed
    progress: { type: Number, default: 0 },

    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null }
  },
  { timestamps: true }
);

module.exports = mongoose.model('ResearchProject', researchProjectSchema);
