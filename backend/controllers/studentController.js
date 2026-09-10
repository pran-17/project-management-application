const bcrypt = require('bcryptjs');
const Student = require('../models/Student');
const Teacher = require('../models/Teacher');
const Project = require('../models/Project');
const User = require('../models/User');

// GET /api/students
const getStudents = async (req, res) => {
  try {
    const students = await Student.find().populate('guide', 'name employeeId department').sort({ createdAt: -1 });
    res.json({ success: true, message: 'Students fetched successfully', data: students });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// GET /api/students/:id
const getStudentById = async (req, res) => {
  try {
    const student = await Student.findById(req.params.id).populate('guide', 'name employeeId department');
    if (!student) {
      return res.status(404).json({ success: false, message: 'Student not found' });
    }
    res.json({ success: true, message: 'Student fetched successfully', data: student });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// POST /api/students
// Admin creates the student record AND a linked login account (User with role 'student')
// so the student can log in immediately using the email/password provided.
const createStudent = async (req, res) => {
  try {
    const { name, registerNumber, email, phone, department, year, status, project, password } = req.body;

    if (!name || !registerNumber || !email || !department) {
      return res.status(400).json({
        success: false,
        message: 'Please provide name, registerNumber, email and department'
      });
    }

    const existingStudent = await Student.findOne({
      $or: [{ registerNumber }, { email: email.toLowerCase() }]
    });

    if (existingStudent) {
      return res.status(400).json({
        success: false,
        message: 'A student with this register number or email already exists'
      });
    }

    const existingUser = await User.findOne({ email: email.toLowerCase() });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: 'A login account with this email already exists'
      });
    }

    const student = await Student.create({
      name,
      registerNumber,
      email,
      phone: phone || '',
      department,
      year: year || '',
      status: status || 'Pending',
      project: project || 'Not Assigned'
    });

    // Default password (used if admin doesn't provide one): the register number.
    // The admin should share this with the student and encourage them to change it.
    const rawPassword = password && password.trim() ? password.trim() : registerNumber;
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(rawPassword, salt);

    await User.create({
      name,
      email: email.toLowerCase(),
      password: hashedPassword,
      role: 'student',
      referenceId: student._id,
      referenceModel: 'Student'
    });

    res.status(201).json({
      success: true,
      message: 'Student added successfully and login account created',
      data: student,
      credentials: { email: email.toLowerCase(), password: rawPassword }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// PUT /api/students/:id
const updateStudent = async (req, res) => {
  try {
    const student = await Student.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });

    if (!student) {
      return res.status(404).json({ success: false, message: 'Student not found' });
    }

    res.json({ success: true, message: 'Student updated successfully', data: student });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// DELETE /api/students/:id
const deleteStudent = async (req, res) => {
  try {
    const student = await Student.findByIdAndDelete(req.params.id);

    if (!student) {
      return res.status(404).json({ success: false, message: 'Student not found' });
    }

    // Remove student from any teacher project counts / project team lists is out of scope here,
    // but we decrement the guide's student count if assigned.
    if (student.guide) {
      const remainingCount = await Student.countDocuments({ guide: student.guide });
      await Teacher.findByIdAndUpdate(student.guide, { students: remainingCount });
    }

    // Remove the linked login account so it can't log in anymore
    await User.deleteOne({ referenceId: student._id, referenceModel: 'Student' });

    res.json({ success: true, message: 'Student deleted successfully', data: student });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// PUT /api/students/:studentId/assign-guide
const assignGuide = async (req, res) => {
  try {
    const { teacherId } = req.body;
    const { studentId } = req.params;

    if (!teacherId) {
      return res.status(400).json({ success: false, message: 'teacherId is required' });
    }

    const teacher = await Teacher.findById(teacherId);
    if (!teacher) {
      return res.status(404).json({ success: false, message: 'Teacher not found' });
    }

    const student = await Student.findById(studentId);
    if (!student) {
      return res.status(404).json({ success: false, message: 'Student not found' });
    }

    const previousGuide = student.guide;

    student.guide = teacher._id;
    student.guideName = teacher.name;
    student.status = 'Assigned';
    await student.save();

    // Recalculate counts
    const newGuideCount = await Student.countDocuments({ guide: teacher._id });
    teacher.students = newGuideCount;
    await teacher.save();

    if (previousGuide && String(previousGuide) !== String(teacher._id)) {
      const prevCount = await Student.countDocuments({ guide: previousGuide });
      await Teacher.findByIdAndUpdate(previousGuide, { students: prevCount });
    }

    // If this student is on a project, link that project to the new guide too, so the
    // teacher can immediately see it under "My Projects" / "My Students" on login.
    const studentProject = await Project.findOne({ students: student._id });
    if (studentProject) {
      studentProject.guide = teacher._id;
      studentProject.guideName = teacher.name;
      await studentProject.save();

      const guidedProjectCount = await Project.countDocuments({ guide: teacher._id });
      teacher.projects = guidedProjectCount;
      await teacher.save();
    }

    const populated = await Student.findById(studentId).populate('guide', 'name employeeId department');

    res.json({ success: true, message: 'Guide assigned successfully', data: populated });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// PUT /api/students/:studentId/remove-guide
const removeGuide = async (req, res) => {
  try {
    const student = await Student.findById(req.params.studentId);
    if (!student) {
      return res.status(404).json({ success: false, message: 'Student not found' });
    }

    const previousGuide = student.guide;

    student.guide = null;
    student.guideName = 'Not Assigned';
    student.status = 'Pending';
    await student.save();

    if (previousGuide) {
      const prevCount = await Student.countDocuments({ guide: previousGuide });
      await Teacher.findByIdAndUpdate(previousGuide, { students: prevCount });

      // If this student's project has no other team member still guided by the same
      // teacher, unlink the project from that guide too.
      const studentProject = await Project.findOne({ students: student._id });
      if (studentProject && String(studentProject.guide) === String(previousGuide)) {
        const teammateStillGuided = await Student.exists({
          _id: { $in: studentProject.students, $ne: student._id },
          guide: previousGuide
        });

        if (!teammateStillGuided) {
          studentProject.guide = null;
          studentProject.guideName = '';
          await studentProject.save();

          const guidedProjectCount = await Project.countDocuments({ guide: previousGuide });
          await Teacher.findByIdAndUpdate(previousGuide, { projects: guidedProjectCount });
        }
      }
    }

    res.json({ success: true, message: 'Guide removed successfully', data: student });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// GET /api/students/me/profile
// Logged-in student views their own profile (uses referenceId from the JWT, not a URL param,
// so a student can never fetch another student's data).
const getMyProfile = async (req, res) => {
  try {
    if (!req.user.referenceId) {
      return res.status(400).json({ success: false, message: 'This account is not linked to a student record' });
    }

    const student = await Student.findById(req.user.referenceId).populate('guide', 'name employeeId department email phone');

    if (!student) {
      return res.status(404).json({ success: false, message: 'Student profile not found' });
    }

    res.json({ success: true, message: 'Profile fetched successfully', data: student });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// PUT /api/students/me/profile
// Student can update a limited set of their own fields. They cannot change registerNumber,
// email, guide, or status themselves.
const updateMyProfile = async (req, res) => {
  try {
    if (!req.user.referenceId) {
      return res.status(400).json({ success: false, message: 'This account is not linked to a student record' });
    }

    const allowedFields = ['phone', 'year', 'department'];
    const updates = {};
    allowedFields.forEach((field) => {
      if (req.body[field] !== undefined) updates[field] = req.body[field];
    });

    const student = await Student.findByIdAndUpdate(req.user.referenceId, updates, {
      new: true,
      runValidators: true
    }).populate('guide', 'name employeeId department email phone');

    if (!student) {
      return res.status(404).json({ success: false, message: 'Student profile not found' });
    }

    res.json({ success: true, message: 'Profile updated successfully', data: student });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// GET /api/students/me/project
// The project this logged-in student is a team member of, including guide and teammates.
const getMyProject = async (req, res) => {
  try {
    if (!req.user.referenceId) {
      return res.status(400).json({ success: false, message: 'This account is not linked to a student record' });
    }

    const project = await Project.findOne({ students: req.user.referenceId })
      .populate('guide', 'name employeeId department email phone')
      .populate('students', 'name registerNumber department email')
      .populate('teamMembers.student', 'name registerNumber department email');

    if (!project) {
      return res.json({ success: true, message: 'No project assigned yet', data: null });
    }

    res.json({ success: true, message: 'Project fetched successfully', data: project });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// GET /api/students/register/:registerNumber
// Looks up a single student by register number. Used when a student is building a
// project team, or when admin is adding students to a research team - both need to
// resolve a register number to a real student record without exposing the full list.
const getStudentByRegisterNumber = async (req, res) => {
  try {
    const { registerNumber } = req.params;

    const student = await Student.findOne({
      registerNumber: new RegExp(`^${registerNumber.trim()}$`, 'i')
    }).select('name registerNumber email department year status');

    if (!student) {
      return res.status(404).json({
        success: false,
        message: `Student not found. Register number ${registerNumber} does not exist.`
      });
    }

    res.json({ success: true, message: 'Student found', data: student });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  getStudentByRegisterNumber,
  getStudents,
  getStudentById,
  createStudent,
  updateStudent,
  deleteStudent,
  assignGuide,
  removeGuide,
  getMyProfile,
  updateMyProfile,
  getMyProject
};
