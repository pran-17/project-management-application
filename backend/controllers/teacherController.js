const bcrypt = require('bcryptjs');
const Teacher = require('../models/Teacher');
const Student = require('../models/Student');
const Project = require('../models/Project');
const User = require('../models/User');

// GET /api/teachers
const getTeachers = async (req, res) => {
  try {
    const teachers = await Teacher.find().sort({ createdAt: -1 });
    res.json({ success: true, message: 'Teachers fetched successfully', data: teachers });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// GET /api/teachers/:id
const getTeacherById = async (req, res) => {
  try {
    const teacher = await Teacher.findById(req.params.id);
    if (!teacher) {
      return res.status(404).json({ success: false, message: 'Teacher not found' });
    }

    const assignedStudents = await Student.find({ guide: teacher._id }).select(
      'name registerNumber department email status'
    );

    res.json({
      success: true,
      message: 'Teacher fetched successfully',
      data: { ...teacher.toObject(), assignedStudents }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// POST /api/teachers
// Admin creates the teacher record AND a linked login account (User with role 'teacher')
// so the teacher can log in immediately using the email/password provided.
const createTeacher = async (req, res) => {
  try {
    const { name, employeeId, email, phone, department, designation, specialization, status, password } = req.body;

    if (!name || !employeeId || !email || !department) {
      return res.status(400).json({
        success: false,
        message: 'Please provide name, employeeId, email and department'
      });
    }

    const existingTeacher = await Teacher.findOne({
      $or: [{ employeeId }, { email: email.toLowerCase() }]
    });

    if (existingTeacher) {
      return res.status(400).json({
        success: false,
        message: 'A teacher with this employee ID or email already exists'
      });
    }

    const existingUser = await User.findOne({ email: email.toLowerCase() });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: 'A login account with this email already exists'
      });
    }

    const teacher = await Teacher.create({
      name,
      employeeId,
      email,
      phone: phone || '',
      department,
      designation: designation || '',
      specialization: specialization || '',
      status: status || 'Active',
      students: 0,
      projects: 0
    });

    // Default password (used if admin doesn't provide one): the employee ID.
    const rawPassword = password && password.trim() ? password.trim() : employeeId;
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(rawPassword, salt);

    await User.create({
      name,
      email: email.toLowerCase(),
      password: hashedPassword,
      role: 'teacher',
      referenceId: teacher._id,
      referenceModel: 'Teacher'
    });

    res.status(201).json({
      success: true,
      message: 'Teacher added successfully and login account created',
      data: teacher,
      credentials: { email: email.toLowerCase(), password: rawPassword }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// PUT /api/teachers/:id
const updateTeacher = async (req, res) => {
  try {
    const teacher = await Teacher.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });

    if (!teacher) {
      return res.status(404).json({ success: false, message: 'Teacher not found' });
    }

    res.json({ success: true, message: 'Teacher updated successfully', data: teacher });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// DELETE /api/teachers/:id
const deleteTeacher = async (req, res) => {
  try {
    const teacher = await Teacher.findByIdAndDelete(req.params.id);

    if (!teacher) {
      return res.status(404).json({ success: false, message: 'Teacher not found' });
    }

    // Un-assign this teacher from any students
    await Student.updateMany(
      { guide: teacher._id },
      { $set: { guide: null, guideName: 'Not Assigned', status: 'Pending' } }
    );

    // Remove the linked login account so it can't log in anymore
    await User.deleteOne({ referenceId: teacher._id, referenceModel: 'Teacher' });

    res.json({ success: true, message: 'Teacher deleted successfully', data: teacher });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// PUT /api/teachers/:id/toggle-status
const toggleStatus = async (req, res) => {
  try {
    const teacher = await Teacher.findById(req.params.id);

    if (!teacher) {
      return res.status(404).json({ success: false, message: 'Teacher not found' });
    }

    teacher.status = teacher.status === 'Active' ? 'Inactive' : 'Active';
    await teacher.save();

    res.json({ success: true, message: 'Teacher status updated successfully', data: teacher });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// GET /api/teachers/me/profile
// Logged-in teacher views their own profile (uses referenceId from the JWT).
const getMyProfile = async (req, res) => {
  try {
    if (!req.user.referenceId) {
      return res.status(400).json({ success: false, message: 'This account is not linked to a teacher record' });
    }

    const teacher = await Teacher.findById(req.user.referenceId);

    if (!teacher) {
      return res.status(404).json({ success: false, message: 'Teacher profile not found' });
    }

    res.json({ success: true, message: 'Profile fetched successfully', data: teacher });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// PUT /api/teachers/me/profile
// Teacher can update a limited set of their own fields.
const updateMyProfile = async (req, res) => {
  try {
    if (!req.user.referenceId) {
      return res.status(400).json({ success: false, message: 'This account is not linked to a teacher record' });
    }

    const allowedFields = ['phone', 'designation', 'specialization'];
    const updates = {};
    allowedFields.forEach((field) => {
      if (req.body[field] !== undefined) updates[field] = req.body[field];
    });

    const teacher = await Teacher.findByIdAndUpdate(req.user.referenceId, updates, {
      new: true,
      runValidators: true
    });

    if (!teacher) {
      return res.status(404).json({ success: false, message: 'Teacher profile not found' });
    }

    res.json({ success: true, message: 'Profile updated successfully', data: teacher });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// GET /api/teachers/me/students
// All students currently assigned to the logged-in teacher (guide), with full details.
const getMyStudents = async (req, res) => {
  try {
    if (!req.user.referenceId) {
      return res.status(400).json({ success: false, message: 'This account is not linked to a teacher record' });
    }

    const students = await Student.find({ guide: req.user.referenceId }).sort({ createdAt: -1 });

    res.json({ success: true, message: 'Assigned students fetched successfully', data: students });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// GET /api/teachers/me/projects
// All projects the logged-in teacher is guiding, with team members populated.
const getMyProjects = async (req, res) => {
  try {
    if (!req.user.referenceId) {
      return res.status(400).json({ success: false, message: 'This account is not linked to a teacher record' });
    }

    const projects = await Project.find({ guide: req.user.referenceId })
      .populate('students', 'name registerNumber department email')
      .populate('teamMembers.student', 'name registerNumber department email')
      .sort({ createdAt: -1 });

    res.json({ success: true, message: 'Guided projects fetched successfully', data: projects });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
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
};
