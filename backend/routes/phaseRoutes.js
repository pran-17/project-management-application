const express = require('express');
const router = express.Router();
const {
  createPhase,
  getPhases,
  getPhasesByDepartment,
  getPhaseById,
  updatePhase,
  deletePhase
} = require('../controllers/phaseController');
const { protect } = require('../middleware/authMiddleware');
const { authorize } = require('../middleware/roleMiddleware');

router.get('/', protect, authorize('admin', 'teacher', 'student'), getPhases);
router.get('/department/:department', protect, authorize('admin', 'teacher', 'student'), getPhasesByDepartment);
router.get('/:id', protect, authorize('admin', 'teacher', 'student'), getPhaseById);
router.post('/', protect, authorize('admin'), createPhase);
router.put('/:id', protect, authorize('admin'), updatePhase);
router.delete('/:id', protect, authorize('admin'), deletePhase);

module.exports = router;
