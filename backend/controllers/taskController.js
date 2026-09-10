const mongoose = require('mongoose');
const Task = require('../models/Task');
const Student = require('../models/Student');
const Teacher = require('../models/Teacher');
const Project = require('../models/Project');
const ProjectPhase = require('../models/ProjectPhase');

const TASK_STATUSES = ['Pending', 'In Progress', 'Under Review', 'Completed'];
const TASK_PRIORITIES = ['Low', 'Medium', 'High'];

const TASK_POPULATE = [
  { path: 'student', select: 'name registerNumber department email' },
  { path: 'guide', select: 'name employeeId department email' },
  { path: 'project', select: 'projectId projectTitle department status progress' },
  { path: 'phase', select: 'phaseNumber phaseName department startDate endDate status' }
];

const isValidId = (id) => mongoose.Types.ObjectId.isValid(id);

const idOf = (ref) => {
  if (!ref) return '';
  if (typeof ref === 'object') return String(ref._id || '');
  return String(ref);
};

const loadStudentContext = async (referenceId) => {
  const student = await Student.findById(referenceId);
  if (!student) return { error: { status: 404, message: 'Student profile not found' } };

  const project = await Project.findOne({
    $or: [{ students: student._id }, { 'teamMembers.student': student._id }]
  });
  return { student, project };
};

const teacherOwnsStudent = async (teacherId, studentId) => {
  if (!teacherId || !studentId) return false;
  const student = await Student.findById(studentId).select('guide');
  return !!(student && student.guide && String(student.guide) === String(teacherId));
};

const assertTaskAccess = async (req, task) => {
  if (req.user.role === 'student') {
    if (!req.user.referenceId || idOf(task.student) !== String(req.user.referenceId)) {
      return { ok: false, status: 403, message: 'Access denied: you can only access your own tasks' };
    }
    return { ok: true };
  }

  if (req.user.role === 'teacher') {
    const owns = await teacherOwnsStudent(req.user.referenceId, idOf(task.student));
    if (!owns) {
      return { ok: false, status: 403, message: 'Access denied: this task belongs to another guide' };
    }
    return { ok: true };
  }

  return { ok: false, status: 403, message: 'Access denied' };
};

const applyTaskQueryFilters = (query, req) => {
  const { department, status, priority, student, guide, project, phase } = req.query;
  if (department) query.department = department;
  if (status) query.status = status;
  if (priority) query.priority = priority;
  if (student && isValidId(student)) query.student = student;
  if (guide && isValidId(guide)) query.guide = guide;
  if (project && isValidId(project)) query.project = project;
  if (phase && isValidId(phase)) query.phase = phase;
  return query;
};

// POST /api/tasks
const createTask = async (req, res) => {
  try {
    if (!req.user.referenceId) {
      return res.status(400).json({ success: false, message: 'This account is not linked to a student record' });
    }

    const { title, description, phase, priority, assignedDate, dueDate, studentWork, progress, status, studentRemark } = req.body;
    // Ignore any client-supplied studentId / guideId / teacherId / project / department.

    if (!title || !phase) {
      return res.status(400).json({ success: false, message: 'Please provide task title and project phase' });
    }

    if (!isValidId(phase)) {
      return res.status(400).json({ success: false, message: 'Invalid phase id' });
    }

    if (priority && !TASK_PRIORITIES.includes(priority)) {
      return res.status(400).json({ success: false, message: 'Invalid priority' });
    }

    if (status && !TASK_STATUSES.includes(status)) {
      return res.status(400).json({ success: false, message: 'Invalid status' });
    }

    const ctx = await loadStudentContext(req.user.referenceId);
    if (ctx.error) {
      return res.status(ctx.error.status).json({ success: false, message: ctx.error.message });
    }

    const { student, project } = ctx;
    if (!student.guide) {
      return res.status(400).json({
        success: false,
        message: 'A project guide must be assigned before you can create tasks'
      });
    }

    const phaseDoc = await ProjectPhase.findById(phase);
    if (!phaseDoc) {
      return res.status(404).json({ success: false, message: 'Project phase not found' });
    }

    if (phaseDoc.department !== student.department) {
      return res.status(403).json({
        success: false,
        message: 'Access denied: you can only create tasks for your department phases'
      });
    }

    const nextStatus = status || 'Pending';
    const task = await Task.create({
      title: title.trim(),
      description: description || '',
      student: student._id,
      guide: student.guide,
      project: project ? project._id : null,
      phase: phaseDoc._id,
      department: student.department,
      priority: priority || 'Medium',
      status: nextStatus,
      progress: Number.isFinite(Number(progress)) ? Math.min(100, Math.max(0, Number(progress))) : 0,
      assignedDate: assignedDate || new Date(),
      dueDate: dueDate || null,
      studentWork: studentWork || '',
      studentRemark: studentRemark || '',
      submittedAt: nextStatus === 'Under Review' ? new Date() : null
    });

    const populated = await Task.findById(task._id).populate(TASK_POPULATE);
    res.status(201).json({ success: true, message: 'Task created successfully', data: populated });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// GET /api/tasks/me
const getMyTasks = async (req, res) => {
  try {
    if (!req.user.referenceId) {
      return res.status(400).json({ success: false, message: 'This account is not linked to a student record' });
    }

    const query = applyTaskQueryFilters({ student: req.user.referenceId }, req);
    const tasks = await Task.find(query).populate(TASK_POPULATE).sort({ updatedAt: -1 });
    res.json({ success: true, message: 'Tasks fetched successfully', data: tasks });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// GET /api/tasks/teacher
const getTeacherTasks = async (req, res) => {
  try {
    if (!req.user.referenceId) {
      return res.status(400).json({ success: false, message: 'This account is not linked to a teacher record' });
    }

    const teacher = await Teacher.findById(req.user.referenceId);
    if (!teacher) {
      return res.status(404).json({ success: false, message: 'Teacher profile not found' });
    }

    const assignedStudents = await Student.find({ guide: teacher._id }).select('_id');
    const assignedIds = assignedStudents.map((s) => s._id);

    const query = applyTaskQueryFilters({}, req);
    if (query.student) {
      if (!assignedIds.some((id) => String(id) === String(query.student))) {
        return res.json({ success: true, message: 'Assigned student tasks fetched successfully', data: [] });
      }
    } else {
      query.student = { $in: assignedIds };
    }
    delete query.guide;

    const tasks = await Task.find(query).populate(TASK_POPULATE).sort({ updatedAt: -1 });
    res.json({ success: true, message: 'Assigned student tasks fetched successfully', data: tasks });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// GET /api/tasks/:id
const getTaskById = async (req, res) => {
  try {
    if (!isValidId(req.params.id)) {
      return res.status(400).json({ success: false, message: 'Invalid task id' });
    }

    const task = await Task.findById(req.params.id).populate(TASK_POPULATE);
    if (!task) {
      return res.status(404).json({ success: false, message: 'Task not found' });
    }

    const access = await assertTaskAccess(req, task);
    if (!access.ok) {
      return res.status(access.status).json({ success: false, message: access.message });
    }

    res.json({ success: true, message: 'Task fetched successfully', data: task });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// PUT /api/tasks/:id
const updateTask = async (req, res) => {
  try {
    if (!isValidId(req.params.id)) {
      return res.status(400).json({ success: false, message: 'Invalid task id' });
    }

    const task = await Task.findById(req.params.id);
    if (!task) {
      return res.status(404).json({ success: false, message: 'Task not found' });
    }

    if (req.user.role !== 'student' || idOf(task.student) !== String(req.user.referenceId)) {
      return res.status(403).json({ success: false, message: 'Access denied: you can only update your own tasks' });
    }

    const {
      title,
      description,
      phase,
      priority,
      assignedDate,
      dueDate,
      studentWork,
      progress,
      status,
      studentRemark
    } = req.body;

    if (priority && !TASK_PRIORITIES.includes(priority)) {
      return res.status(400).json({ success: false, message: 'Invalid priority' });
    }

    if (status && !TASK_STATUSES.includes(status)) {
      return res.status(400).json({ success: false, message: 'Invalid status' });
    }

    if (phase && String(phase) !== String(task.phase)) {
      if (!isValidId(phase)) {
        return res.status(400).json({ success: false, message: 'Invalid phase id' });
      }
      const phaseDoc = await ProjectPhase.findById(phase);
      if (!phaseDoc) {
        return res.status(404).json({ success: false, message: 'Project phase not found' });
      }
      if (phaseDoc.department !== task.department) {
        return res.status(403).json({
          success: false,
          message: 'Access denied: you can only use phases from your department'
        });
      }
      task.phase = phaseDoc._id;
    }

    if (title !== undefined) task.title = title.trim();
    if (description !== undefined) task.description = description;
    if (priority !== undefined) task.priority = priority;
    if (assignedDate !== undefined) task.assignedDate = assignedDate;
    if (dueDate !== undefined) task.dueDate = dueDate;
    if (studentWork !== undefined) task.studentWork = studentWork;
    if (studentRemark !== undefined) task.studentRemark = studentRemark;
    if (progress !== undefined) {
      task.progress = Math.min(100, Math.max(0, Number(progress)));
    }
    if (status !== undefined) {
      if (status === 'Under Review' && task.status !== 'Under Review') {
        task.submittedAt = new Date();
      }
      task.status = status;
    }

    await task.save();
    const populated = await Task.findById(task._id).populate(TASK_POPULATE);
    res.json({ success: true, message: 'Task updated successfully', data: populated });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// DELETE /api/tasks/:id
const deleteTask = async (req, res) => {
  try {
    if (!isValidId(req.params.id)) {
      return res.status(400).json({ success: false, message: 'Invalid task id' });
    }

    const task = await Task.findById(req.params.id);
    if (!task) {
      return res.status(404).json({ success: false, message: 'Task not found' });
    }

    if (req.user.role !== 'student' || idOf(task.student) !== String(req.user.referenceId)) {
      return res.status(403).json({ success: false, message: 'Access denied: you can only delete your own tasks' });
    }

    if (task.status === 'Completed') {
      return res.status(400).json({ success: false, message: 'Completed tasks cannot be deleted' });
    }

    await task.deleteOne();
    res.json({ success: true, message: 'Task deleted successfully', data: task });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// PUT /api/tasks/:id/review
const reviewTask = async (req, res) => {
  try {
    if (!isValidId(req.params.id)) {
      return res.status(400).json({ success: false, message: 'Invalid task id' });
    }

    const task = await Task.findById(req.params.id);
    if (!task) {
      return res.status(404).json({ success: false, message: 'Task not found' });
    }

    const owns = await teacherOwnsStudent(req.user.referenceId, idOf(task.student));
    if (!owns) {
      return res.status(403).json({
        success: false,
        message: 'Access denied: you can only review tasks of students assigned to you'
      });
    }

    const { teacherRemark, status, progress } = req.body;

    if (status && !TASK_STATUSES.includes(status)) {
      return res.status(400).json({ success: false, message: 'Invalid status' });
    }

    if (teacherRemark !== undefined) task.teacherRemark = teacherRemark;
    if (status !== undefined) task.status = status;
    if (progress !== undefined) {
      task.progress = Math.min(100, Math.max(0, Number(progress)));
    }
    task.reviewedAt = new Date();

    await task.save();
    const populated = await Task.findById(task._id).populate(TASK_POPULATE);
    res.json({ success: true, message: 'Task reviewed successfully', data: populated });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  createTask,
  getMyTasks,
  getTeacherTasks,
  getTaskById,
  updateTask,
  deleteTask,
  reviewTask
};
