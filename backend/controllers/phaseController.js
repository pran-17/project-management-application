const mongoose = require('mongoose');
const ProjectPhase = require('../models/ProjectPhase');
const Task = require('../models/Task');
const Student = require('../models/Student');
const Teacher = require('../models/Teacher');

const PHASE_STATUSES = ['Active', 'Inactive', 'Completed', 'Upcoming'];

const getRoleDepartment = async (user) => {
  if (!user) return null;
  if (user.role === 'student') {
    if (!user.referenceId) return null;
    const student = await Student.findById(user.referenceId).select('department');
    return student?.department || null;
  }
  if (user.role === 'teacher') {
    if (!user.referenceId) return null;
    const teacher = await Teacher.findById(user.referenceId).select('department');
    return teacher?.department || null;
  }
  return null;
};

const assertPhaseAccess = async (req, phase) => {
  if (req.user.role === 'admin') return { ok: true };
  const department = await getRoleDepartment(req.user);
  if (!department) {
    return { ok: false, status: 400, message: 'Account is not linked to a profile with a department' };
  }
  if (phase.department !== department) {
    return { ok: false, status: 403, message: 'Access denied: this phase belongs to another department' };
  }
  return { ok: true };
};

const buildTaskFilterForRole = (req) => {
  if (req.user.role === 'student') return { student: req.user.referenceId };
  if (req.user.role === 'teacher') return { guide: req.user.referenceId };
  // Admin: tasks are not an admin concern - phases show no task-derived stats for admin.
  return { _id: null };
};

const attachPhaseStats = async (phases, req) => {
  const list = Array.isArray(phases) ? phases : [phases];
  const ids = list.map((p) => p._id);
  const taskFilter = { phase: { $in: ids }, ...buildTaskFilterForRole(req) };
  const tasks = ids.length ? await Task.find(taskFilter).select('phase status progress') : [];

  const byPhase = {};
  tasks.forEach((task) => {
    const key = String(task.phase);
    if (!byPhase[key]) {
      byPhase[key] = { total: 0, completed: 0, inProgress: 0, pending: 0, underReview: 0, progressSum: 0 };
    }
    const bucket = byPhase[key];
    bucket.total += 1;
    bucket.progressSum += task.progress || 0;
    if (task.status === 'Completed') bucket.completed += 1;
    else if (task.status === 'In Progress') bucket.inProgress += 1;
    else if (task.status === 'Pending') bucket.pending += 1;
    else if (task.status === 'Under Review') bucket.underReview += 1;
  });

  const withStats = list.map((phase) => {
    const obj = phase.toObject ? phase.toObject() : { ...phase };
    const stats = byPhase[String(phase._id)] || {
      total: 0,
      completed: 0,
      inProgress: 0,
      pending: 0,
      underReview: 0,
      progressSum: 0
    };
    obj.taskCount = stats.total;
    obj.completedTasks = stats.completed;
    obj.inProgressTasks = stats.inProgress;
    obj.pendingTasks = stats.pending;
    obj.underReviewTasks = stats.underReview;
    obj.progress = stats.total ? Math.round(stats.progressSum / stats.total) : 0;
    return obj;
  });

  return Array.isArray(phases) ? withStats : withStats[0];
};

// POST /api/phases
const createPhase = async (req, res) => {
  try {
    const { phaseNumber, phaseName, description, department, startDate, endDate, status } = req.body;

    if (phaseNumber === undefined || !phaseName || !department || !startDate || !endDate) {
      return res.status(400).json({
        success: false,
        message: 'Please provide phaseNumber, phaseName, department, startDate and endDate'
      });
    }

    if (status && !PHASE_STATUSES.includes(status)) {
      return res.status(400).json({ success: false, message: 'Invalid phase status' });
    }

    if (new Date(endDate) < new Date(startDate)) {
      return res.status(400).json({ success: false, message: 'End date cannot be before start date' });
    }

    const existing = await ProjectPhase.findOne({ phaseNumber: Number(phaseNumber), department: department.trim() });
    if (existing) {
      return res.status(400).json({
        success: false,
        message: `Phase ${phaseNumber} already exists for ${department}`
      });
    }

    const phase = await ProjectPhase.create({
      phaseNumber: Number(phaseNumber),
      phaseName: phaseName.trim(),
      description: description || '',
      department: department.trim(),
      startDate,
      endDate,
      status: status || 'Upcoming',
      createdBy: req.user.id
    });

    res.status(201).json({ success: true, message: 'Phase created successfully', data: phase });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({
        success: false,
        message: 'A phase with this number already exists for the selected department'
      });
    }
    res.status(500).json({ success: false, message: error.message });
  }
};

// GET /api/phases
const getPhases = async (req, res) => {
  try {
    const query = {};

    if (req.user.role === 'student' || req.user.role === 'teacher') {
      const department = await getRoleDepartment(req.user);
      if (!department) {
        return res.status(400).json({
          success: false,
          message: 'Account is not linked to a profile with a department'
        });
      }
      query.department = department;
    } else if (req.query.department) {
      query.department = req.query.department;
    }

    if (req.query.status) query.status = req.query.status;

    const phases = await ProjectPhase.find(query)
      .populate('createdBy', 'name email role')
      .sort({ department: 1, phaseNumber: 1 });

    const data = await attachPhaseStats(phases, req);
    res.json({ success: true, message: 'Phases fetched successfully', data });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// GET /api/phases/department/:department
const getPhasesByDepartment = async (req, res) => {
  try {
    const requested = decodeURIComponent(req.params.department || '').trim();
    if (!requested) {
      return res.status(400).json({ success: false, message: 'Department is required' });
    }

    if (req.user.role === 'student' || req.user.role === 'teacher') {
      const department = await getRoleDepartment(req.user);
      if (!department) {
        return res.status(400).json({
          success: false,
          message: 'Account is not linked to a profile with a department'
        });
      }
      if (department !== requested) {
        return res.status(403).json({
          success: false,
          message: 'Access denied: you can only view phases for your department'
        });
      }
    }

    const phases = await ProjectPhase.find({ department: requested }).sort({ phaseNumber: 1 });
    const data = await attachPhaseStats(phases, req);
    res.json({ success: true, message: 'Department phases fetched successfully', data });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// GET /api/phases/:id
const getPhaseById = async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ success: false, message: 'Invalid phase id' });
    }

    const phase = await ProjectPhase.findById(req.params.id).populate('createdBy', 'name email role');
    if (!phase) {
      return res.status(404).json({ success: false, message: 'Phase not found' });
    }

    const access = await assertPhaseAccess(req, phase);
    if (!access.ok) {
      return res.status(access.status).json({ success: false, message: access.message });
    }

    const data = await attachPhaseStats(phase, req);

    const taskFilter = { phase: phase._id, ...buildTaskFilterForRole(req) };
    const tasks = await Task.find(taskFilter)
      .populate('student', 'name registerNumber department')
      .populate('guide', 'name employeeId department')
      .populate('project', 'projectId projectTitle department')
      .sort({ createdAt: -1 });

    data.tasks = tasks;
    res.json({ success: true, message: 'Phase fetched successfully', data });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// PUT /api/phases/:id
const updatePhase = async (req, res) => {
  try {
    const phase = await ProjectPhase.findById(req.params.id);
    if (!phase) {
      return res.status(404).json({ success: false, message: 'Phase not found' });
    }

    const { phaseNumber, phaseName, description, department, startDate, endDate, status } = req.body;

    if (status && !PHASE_STATUSES.includes(status)) {
      return res.status(400).json({ success: false, message: 'Invalid phase status' });
    }

    const nextNumber = phaseNumber !== undefined ? Number(phaseNumber) : phase.phaseNumber;
    const nextDepartment = department !== undefined ? department.trim() : phase.department;

    if (nextNumber !== phase.phaseNumber || nextDepartment !== phase.department) {
      const clash = await ProjectPhase.findOne({
        _id: { $ne: phase._id },
        phaseNumber: nextNumber,
        department: nextDepartment
      });
      if (clash) {
        return res.status(400).json({
          success: false,
          message: `Phase ${nextNumber} already exists for ${nextDepartment}`
        });
      }
    }

    if (phaseNumber !== undefined) phase.phaseNumber = nextNumber;
    if (phaseName !== undefined) phase.phaseName = phaseName.trim();
    if (description !== undefined) phase.description = description;
    if (department !== undefined) phase.department = nextDepartment;
    if (startDate !== undefined) phase.startDate = startDate;
    if (endDate !== undefined) phase.endDate = endDate;

    const nextStart = startDate !== undefined ? startDate : phase.startDate;
    const nextEnd = endDate !== undefined ? endDate : phase.endDate;
    if (nextStart && nextEnd && new Date(nextEnd) < new Date(nextStart)) {
      return res.status(400).json({ success: false, message: 'End date cannot be before start date' });
    }
    if (status !== undefined) phase.status = status;

    await phase.save();
    res.json({ success: true, message: 'Phase updated successfully', data: phase });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({
        success: false,
        message: 'A phase with this number already exists for the selected department'
      });
    }
    res.status(500).json({ success: false, message: error.message });
  }
};

// DELETE /api/phases/:id
const deletePhase = async (req, res) => {
  try {
    const phase = await ProjectPhase.findById(req.params.id);
    if (!phase) {
      return res.status(404).json({ success: false, message: 'Phase not found' });
    }

    const taskCount = await Task.countDocuments({ phase: phase._id });
    if (taskCount > 0) {
      return res.status(400).json({
        success: false,
        message: `Cannot delete this phase because ${taskCount} task(s) are linked to it`
      });
    }

    await phase.deleteOne();
    res.json({ success: true, message: 'Phase deleted successfully', data: phase });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  createPhase,
  getPhases,
  getPhasesByDepartment,
  getPhaseById,
  updatePhase,
  deletePhase
};
