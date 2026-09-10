const express = require('express');
const router = express.Router();
const {
  getProjects,
  getProjectById,
  createProject,
  createMyProject,
  updateProject,
  deleteProject
} = require('../controllers/projectController');
const { protect } = require('../middleware/authMiddleware');
const { authorize } = require('../middleware/roleMiddleware');

router.get('/', protect, getProjects);
// Must come before '/:id' so it's never parsed as an ObjectId
router.post('/me', protect, authorize('student'), createMyProject);
router.get('/:id', protect, getProjectById);
router.post('/', protect, authorize('admin'), createProject);
// Admin can update any project; teachers can update only projects they guide (checked in controller)
router.put('/:id', protect, authorize('admin', 'teacher'), updateProject);
router.delete('/:id', protect, authorize('admin'), deleteProject);

module.exports = router;
