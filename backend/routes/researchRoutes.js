const express = require('express');
const router = express.Router();
const {
  getResearchProjects,
  getResearchProjectById,
  createResearchProject,
  updateResearchProject,
  deleteResearchProject
} = require('../controllers/researchController');
const { protect } = require('../middleware/authMiddleware');
const { authorize } = require('../middleware/roleMiddleware');

router.get('/', protect, getResearchProjects);
router.get('/:id', protect, getResearchProjectById);
router.post('/', protect, authorize('admin'), createResearchProject);
router.put('/:id', protect, authorize('admin'), updateResearchProject);
router.delete('/:id', protect, authorize('admin'), deleteResearchProject);

module.exports = router;
