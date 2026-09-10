const mongoose = require('mongoose');

const researchFundingSchema = new mongoose.Schema(
  {
    fundingId: { type: String, required: true, unique: true, trim: true },
    projectTitle: { type: String, required: true },
    fundingAgency: { type: String, default: '' },
    fundingProviderName: { type: String, default: '' },
    principalInvestigator: { type: String, required: true },
    department: { type: String, required: true },
    startDate: { type: String, default: '' },
    endDate: { type: String, default: '' },
    totalAmount: { type: Number, required: true, default: 0 },
    utilizedAmount: { type: Number, default: 0 },
    remainingAmount: { type: Number, default: 0 },
    status: { type: String, default: 'Active' }
  },
  { timestamps: true }
);

// Auto-calculate remainingAmount before save/update
researchFundingSchema.pre('save', function (next) {
  this.remainingAmount = (this.totalAmount || 0) - (this.utilizedAmount || 0);
  next();
});

module.exports = mongoose.model('ResearchFunding', researchFundingSchema);
