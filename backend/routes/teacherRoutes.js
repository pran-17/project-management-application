const express = require('express');
const router = express.Router();
const {
  getTeachers,
  getTeacherById,
  createTeacher,
  updateTeacher,
  deleteTeacher,
  toggleStatus,
  getMyProfile,
  updateMyProfile,
  getMyStudents,
  getMyProjects
} = require('../controllers/teacherController');
const { protect } = require('../middleware/authMiddleware');
const { authorize } = require('../middleware/roleMiddleware');

// Self-service routes MUST come before '/:id' so 'me' is never parsed as an ObjectId
router.get('/me/profile', protect, authorize('teacher'), getMyProfile);
router.put('/me/profile', protect, authorize('teacher'), updateMyProfile);
router.get('/me/students', protect, authorize('teacher'), getMyStudents);
router.get('/me/projects', protect, authorize('teacher'), getMyProjects);

router.get('/', protect, getTeachers);
router.get('/:id', protect, getTeacherById);
router.post('/', protect, authorize('admin'), createTeacher);
router.put('/:id/toggle-status', protect, authorize('admin'), toggleStatus);
router.put('/:id', protect, authorize('admin'), updateTeacher);
router.delete('/:id', protect, authorize('admin'), deleteTeacher);

module.exports = router;
