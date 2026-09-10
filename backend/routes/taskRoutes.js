const express = require('express');
const router = express.Router();
const {
  createTask,
  getMyTasks,
  getTeacherTasks,
  getAdminTasks,
  getTaskById,
  updateTask,
  deleteTask,
  reviewTask
} = require('../controllers/taskController');
const { protect } = require('../middleware/authMiddleware');
const { authorize } = require('../middleware/roleMiddleware');

router.post('/', protect, authorize('student'), createTask);
router.get('/me', protect, authorize('student'), getMyTasks);
router.get('/teacher', protect, authorize('teacher'), getTeacherTasks);
router.put('/:id/review', protect, authorize('teacher'), reviewTask);
router.get('/:id', protect, authorize('teacher', 'student'), getTaskById);
router.put('/:id', protect, authorize('student'), updateTask);
router.delete('/:id', protect, authorize('student'), deleteTask);

module.exports = router;
