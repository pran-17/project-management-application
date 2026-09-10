const express = require('express');
const router = express.Router();
const {
  getStudents,
  getStudentById,
  getStudentByRegisterNumber,
  createStudent,
  updateStudent,
  deleteStudent,
  assignGuide,
  removeGuide,
  getMyProfile,
  updateMyProfile,
  getMyProject
} = require('../controllers/studentController');
const { protect } = require('../middleware/authMiddleware');
const { authorize } = require('../middleware/roleMiddleware');

// Self-service and lookup routes MUST come before '/:id' so they're never parsed as an ObjectId
router.get('/me/profile', protect, authorize('student'), getMyProfile);
router.put('/me/profile', protect, authorize('student'), updateMyProfile);
router.get('/me/project', protect, authorize('student'), getMyProject);
router.get('/register/:registerNumber', protect, getStudentByRegisterNumber);

router.get('/', protect, getStudents);
router.get('/:id', protect, getStudentById);
router.post('/', protect, authorize('admin'), createStudent);
router.put('/:studentId/assign-guide', protect, authorize('admin'), assignGuide);
router.put('/:studentId/remove-guide', protect, authorize('admin'), removeGuide);
router.put('/:id', protect, authorize('admin'), updateStudent);
router.delete('/:id', protect, authorize('admin'), deleteStudent);

module.exports = router;
