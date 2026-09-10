const ResearchFunding = require('../models/ResearchFunding');

// GET /api/funding
const getFundings = async (req, res) => {
  try {
    const fundings = await ResearchFunding.find().sort({ createdAt: -1 });
    res.json({ success: true, message: 'Funding records fetched successfully', data: fundings });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// GET /api/funding/:id
const getFundingById = async (req, res) => {
  try {
    const funding = await ResearchFunding.findById(req.params.id);
    if (!funding) {
      return res.status(404).json({ success: false, message: 'Funding record not found' });
    }
    res.json({ success: true, message: 'Funding record fetched successfully', data: funding });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// POST /api/funding
const createFunding = async (req, res) => {
  try {
    const {
      fundingId,
      projectTitle,
      fundingAgency,
      fundingProviderName,
      principalInvestigator,
      department,
      startDate,
      endDate,
      totalAmount,
      utilizedAmount,
      status
    } = req.body;

    if (!fundingId || !projectTitle || !principalInvestigator || !department || totalAmount === undefined) {
      return res.status(400).json({
        success: false,
        message: 'Please provide fundingId, projectTitle, principalInvestigator, department and totalAmount'
      });
    }

    const existing = await ResearchFunding.findOne({ fundingId });
    if (existing) {
      return res.status(400).json({ success: false, message: 'A funding record with this fundingId already exists' });
    }

    const total = Number(totalAmount) || 0;
    const utilized = Number(utilizedAmount) || 0;

    const funding = await ResearchFunding.create({
      fundingId,
      projectTitle,
      fundingAgency: fundingAgency || '',
      fundingProviderName: fundingProviderName || fundingAgency || '',
      principalInvestigator,
      department,
      startDate: startDate || '',
      endDate: endDate || '',
      totalAmount: total,
      utilizedAmount: utilized,
      remainingAmount: total - utilized,
      status: status || 'Active'
    });

    res.status(201).json({ success: true, message: 'Funding record added successfully', data: funding });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// PUT /api/funding/:id
const updateFunding = async (req, res) => {
  try {
    const funding = await ResearchFunding.findById(req.params.id);

    if (!funding) {
      return res.status(404).json({ success: false, message: 'Funding record not found' });
    }

    Object.assign(funding, req.body);

    // Recalculate remainingAmount whenever totalAmount/utilizedAmount changes
    funding.remainingAmount = (Number(funding.totalAmount) || 0) - (Number(funding.utilizedAmount) || 0);

    await funding.save();

    res.json({ success: true, message: 'Funding record updated successfully', data: funding });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// DELETE /api/funding/:id
const deleteFunding = async (req, res) => {
  try {
    const funding = await ResearchFunding.findByIdAndDelete(req.params.id);

    if (!funding) {
      return res.status(404).json({ success: false, message: 'Funding record not found' });
    }

    res.json({ success: true, message: 'Funding record deleted successfully', data: funding });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  getFundings,
  getFundingById,
  createFunding,
  updateFunding,
  deleteFunding
};
