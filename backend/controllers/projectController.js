const Project = require('../models/Project');
const Teacher = require('../models/Teacher');
const Student = require('../models/Student');

// GET /api/projects
const getProjects = async (req, res) => {
  try {
    const projects = await Project.find()
      .populate('guide', 'name employeeId department')
      .populate('students', 'name registerNumber department')
      .populate('teamMembers.student', 'name registerNumber department email')
      .sort({ createdAt: -1 });
    res.json({ success: true, message: 'Projects fetched successfully', data: projects });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// GET /api/projects/:id
const getProjectById = async (req, res) => {
  try {
    const project = await Project.findById(req.params.id)
      .populate('guide', 'name employeeId department')
      .populate('students', 'name registerNumber department email')
      .populate('teamMembers.student', 'name registerNumber department email');

    if (!project) {
      return res.status(404).json({ success: false, message: 'Project not found' });
    }

    res.json({ success: true, message: 'Project fetched successfully', data: project });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// POST /api/projects
const createProject = async (req, res) => {
  try {
    const {
      projectId,
      projectTitle,
      description,
      department,
      guide,
      guideName: guideNameInput,
      students,
      status,
      progress,
      startDate,
      endDate
    } = req.body;

    if (!projectId || !projectTitle || !department) {
      return res.status(400).json({
        success: false,
        message: 'Please provide projectId, projectTitle and department'
      });
    }

    const existing = await Project.findOne({ projectId });
    if (existing) {
      return res.status(400).json({ success: false, message: 'A project with this projectId already exists' });
    }

    let guideName = guideNameInput || '';

    // If a real Teacher ObjectId was supplied, link it properly and keep counts in sync.
    if (guide) {
      const teacherDoc = await Teacher.findById(guide).catch(() => null);
      if (teacherDoc) {
        guideName = teacherDoc.name;
        teacherDoc.projects = (teacherDoc.projects || 0) + 1;
        await teacherDoc.save();
      }
    }

    const project = await Project.create({
      projectId,
      projectTitle,
      description: description || '',
      department,
      guide: guide || null,
      guideName,
      students: students || [],
      status: status || 'Not Started',
      progress: progress || 0,
      startDate: startDate || null,
      endDate: endDate || null
    });

    res.status(201).json({ success: true, message: 'Project created successfully', data: project });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// PUT /api/projects/:id
// Admin can update any project. A teacher may only update a project they are the guide for
// (e.g. to update status/progress), and only that subset of fields.
const updateProject = async (req, res) => {
  try {
    const existing = await Project.findById(req.params.id);

    if (!existing) {
      return res.status(404).json({ success: false, message: 'Project not found' });
    }

    let updates = req.body;

    if (req.user.role === 'teacher') {
      if (!existing.guide || String(existing.guide) !== String(req.user.referenceId)) {
        return res.status(403).json({
          success: false,
          message: 'You can only update projects you are guiding'
        });
      }
      // Teachers may only update status/progress/description, not reassign guide/team/etc.
      const allowedFields = ['status', 'progress', 'description'];
      updates = {};
      allowedFields.forEach((field) => {
        if (req.body[field] !== undefined) updates[field] = req.body[field];
      });
    }

    const project = await Project.findByIdAndUpdate(req.params.id, updates, {
      new: true,
      runValidators: true
    })
      .populate('guide', 'name employeeId department')
      .populate('students', 'name registerNumber department');

    res.json({ success: true, message: 'Project updated successfully', data: project });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// DELETE /api/projects/:id
const deleteProject = async (req, res) => {
  try {
    const project = await Project.findByIdAndDelete(req.params.id);

    if (!project) {
      return res.status(404).json({ success: false, message: 'Project not found' });
    }

    if (project.guide) {
      const remaining = await Project.countDocuments({ guide: project.guide });
      await Teacher.findByIdAndUpdate(project.guide, { projects: remaining });
    }

    res.json({ success: true, message: 'Project deleted successfully', data: project });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// POST /api/projects/me
// A student creates their own project (Individual or Team). Their identity comes from the
// JWT (req.user.referenceId), never from the request body, so a student can only ever create
// a project for themselves. If the student already has an assigned guide, the project is
// linked to that guide automatically so the teacher sees it immediately on login.
const createMyProject = async (req, res) => {
  try {
    const { projectTitle, description, department, type, teamMembers } = req.body;

    if (!projectTitle || !department) {
      return res.status(400).json({
        success: false,
        message: 'Please provide projectTitle and department'
      });
    }

    if (!type || !['Individual', 'Team'].includes(type)) {
      return res.status(400).json({
        success: false,
        message: 'Please select a project type (Individual or Team)'
      });
    }

    const me = await Student.findById(req.user.referenceId);
    if (!me) {
      return res.status(400).json({ success: false, message: 'This account is not linked to a student record' });
    }

    // A student may only be part of one project at a time
    const alreadyOnProject = await Project.findOne({ students: me._id });
    if (alreadyOnProject) {
      return res.status(400).json({
        success: false,
        message: 'You already have a project. Contact your admin to change it.'
      });
    }

    // Build the resolved team member list. The creator is always included as the first
    // member. Register numbers are resolved against MongoDB - never trust a studentId
    // sent from the frontend for identity (per security requirement).
    const resolvedMembers = [
      { student: me._id, registerNumber: me.registerNumber, role: 'Team Lead', work: '' }
    ];

    if (type === 'Team') {
      const incoming = Array.isArray(teamMembers) ? teamMembers : [];

      if (incoming.length === 0) {
        return res.status(400).json({
          success: false,
          message: 'A team project requires at least one more team member besides yourself'
        });
      }

      const seenRegisterNumbers = new Set([me.registerNumber.toLowerCase()]);

      for (const raw of incoming) {
        const regNumber = String(raw.registerNumber || '').trim();

        if (!regNumber) {
          return res.status(400).json({ success: false, message: 'Each team member needs a register number' });
        }

        const key = regNumber.toLowerCase();
        if (seenRegisterNumbers.has(key)) {
          return res.status(400).json({
            success: false,
            message: `${regNumber} has already been added to this team`
          });
        }
        seenRegisterNumbers.add(key);

        const student = await Student.findOne({ registerNumber: new RegExp(`^${regNumber}$`, 'i') });

        if (!student) {
          return res.status(400).json({
            success: false,
            message: `Student not found. Register number ${regNumber} does not exist.`
          });
        }

        // Prevent adding a student who is already on a different active project
        const onOtherProject = await Project.findOne({ students: student._id });
        if (onOtherProject) {
          return res.status(400).json({
            success: false,
            message: `${student.name} (${regNumber}) is already part of another project`
          });
        }

        resolvedMembers.push({
          student: student._id,
          registerNumber: student.registerNumber,
          role: raw.role || 'Team Member',
          work: raw.work || ''
        });
      }

      // Team project must have at least 2 members total (creator + at least one more)
      if (resolvedMembers.length < 2) {
        return res.status(400).json({
          success: false,
          message: 'A team project must have at least 2 members'
        });
      }
    }

    const teamStudentIds = resolvedMembers.map((m) => m.student);

    const projectId = 'PRJ' + Date.now().toString().slice(-8);

    const project = await Project.create({
      projectId,
      projectTitle,
      description: description || '',
      department,
      guide: me.guide || null,
      guideName: me.guideName || '',
      students: teamStudentIds,
      teamMembers: resolvedMembers,
      type,
      status: 'Not Started',
      progress: 0
    });

    // Keep the simple "project" text field on every team member's Student record in sync
    // (used for display on the admin Students table).
    await Student.updateMany({ _id: { $in: teamStudentIds } }, { $set: { project: projectTitle } });

    // If this student already has a guide, bump that guide's project count
    if (me.guide) {
      const guidedCount = await Project.countDocuments({ guide: me.guide });
      await Teacher.findByIdAndUpdate(me.guide, { projects: guidedCount });
    }

    const populated = await Project.findById(project._id)
      .populate('guide', 'name employeeId department')
      .populate('students', 'name registerNumber department email')
      .populate('teamMembers.student', 'name registerNumber department email');

    res.status(201).json({ success: true, message: 'Project created successfully', data: populated });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  getProjects,
  getProjectById,
  createProject,
  createMyProject,
  updateProject,
  deleteProject
};
