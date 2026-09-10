const express = require('express');
const router = express.Router();
const {
  getFundings,
  getFundingById,
  createFunding,
  updateFunding,
  deleteFunding
} = require('../controllers/fundingController');
const { protect } = require('../middleware/authMiddleware');
const { authorize } = require('../middleware/roleMiddleware');

router.get('/', protect, getFundings);
router.get('/:id', protect, getFundingById);
router.post('/', protect, authorize('admin'), createFunding);
router.put('/:id', protect, authorize('admin'), updateFunding);
router.delete('/:id', protect, authorize('admin'), deleteFunding);

module.exports = router;
