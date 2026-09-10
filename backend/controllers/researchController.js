const ResearchProject = require('../models/ResearchProject');
const Teacher = require('../models/Teacher');

const POPULATE_FIELDS = [
  { path: 'principalInvestigator', select: 'name employeeId department email' },
  { path: 'teachers', select: 'name employeeId department email' },
  { path: 'students', select: 'name registerNumber department email' }
];

// GET /api/research
// Returns research projects visible to the authenticated user, filtered by role:
//   admin   -> all research projects
//   teacher -> projects where they are Principal Investigator OR in the teachers array
//   student -> projects where they are in the students array
const getResearchProjects = async (req, res) => {
  try {
    let query = {};

    if (req.user.role === 'teacher') {
      if (!req.user.referenceId) {
        return res.json({ success: true, message: 'Research projects fetched successfully', data: [] });
      }
      query = {
        $or: [{ principalInvestigator: req.user.referenceId }, { teachers: req.user.referenceId }]
      };
    } else if (req.user.role === 'student') {
      if (!req.user.referenceId) {
        return res.json({ success: true, message: 'Research projects fetched successfully', data: [] });
      }
      query = { students: req.user.referenceId };
    }
    // admin -> no filter, sees everything

    const projects = await ResearchProject.find(query)
      .populate(POPULATE_FIELDS)
      .sort({ createdAt: -1 });

    res.json({ success: true, message: 'Research projects fetched successfully', data: projects });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// GET /api/research/:id
const getResearchProjectById = async (req, res) => {
  try {
    const project = await ResearchProject.findById(req.params.id).populate(POPULATE_FIELDS);

    if (!project) {
      return res.status(404).json({ success: false, message: 'Research project not found' });
    }

    // Enforce access on the backend - never trust the frontend route guard alone.
    if (req.user.role === 'teacher') {
      const isPI = String(project.principalInvestigator?._id) === String(req.user.referenceId);
      const isTeamTeacher = project.teachers.some((t) => String(t._id) === String(req.user.referenceId));
      if (!isPI && !isTeamTeacher) {
        return res.status(403).json({ success: false, message: 'You do not have access to this research project' });
      }
    } else if (req.user.role === 'student') {
      const isMember = project.students.some((s) => String(s._id) === String(req.user.referenceId));
      if (!isMember) {
        return res.status(403).json({ success: false, message: 'You do not have access to this research project' });
      }
    }

    res.json({ success: true, message: 'Research project fetched successfully', data: project });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// POST /api/research (admin only - enforced by route middleware)
const createResearchProject = async (req, res) => {
  try {
    const {
      researchId,
      title,
      description,
      researchArea,
      department,
      principalInvestigator,
      teachers,
      students,
      fundingAgency,
      budget,
      startDate,
      endDate,
      status
    } = req.body;

    if (!researchId || !title || !department || !principalInvestigator) {
      return res.status(400).json({
        success: false,
        message: 'Please provide researchId, title, department and principalInvestigator'
      });
    }

    const existing = await ResearchProject.findOne({ researchId });
    if (existing) {
      return res.status(400).json({ success: false, message: 'A research project with this researchId already exists' });
    }

    const piTeacher = await Teacher.findById(principalInvestigator);
    if (!piTeacher) {
      return res.status(400).json({ success: false, message: 'Selected Principal Investigator was not found' });
    }

    const project = await ResearchProject.create({
      researchId,
      title,
      description: description || '',
      researchArea: researchArea || '',
      department,
      principalInvestigator,
      teachers: Array.isArray(teachers) ? teachers : [],
      students: Array.isArray(students) ? students : [],
      fundingAgency: fundingAgency || '',
      budget: budget || 0,
      startDate: startDate || null,
      endDate: endDate || null,
      status: status || 'Pending',
      createdBy: req.user.id
    });

    const populated = await ResearchProject.findById(project._id).populate(POPULATE_FIELDS);

    res.status(201).json({ success: true, message: 'Research project created successfully', data: populated });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// PUT /api/research/:id (admin only - enforced by route middleware)
const updateResearchProject = async (req, res) => {
  try {
    const project = await ResearchProject.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    }).populate(POPULATE_FIELDS);

    if (!project) {
      return res.status(404).json({ success: false, message: 'Research project not found' });
    }

    res.json({ success: true, message: 'Research project updated successfully', data: project });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// DELETE /api/research/:id (admin only - enforced by route middleware)
const deleteResearchProject = async (req, res) => {
  try {
    const project = await ResearchProject.findByIdAndDelete(req.params.id);

    if (!project) {
      return res.status(404).json({ success: false, message: 'Research project not found' });
    }

    res.json({ success: true, message: 'Research project deleted successfully', data: project });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  getResearchProjects,
  getResearchProjectById,
  createResearchProject,
  updateResearchProject,
  deleteResearchProject
};
