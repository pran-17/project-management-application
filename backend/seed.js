// Run with: npm run seed
// Creates default login accounts (admin / teacher / student) so the existing
// Angular login page (admin@test.com, teacher@test.com, student@test.com / 123456)
// works against the real backend.

require('dotenv').config();
const bcrypt = require('bcryptjs');
const connectDB = require('./config/db');
const User = require('./models/User');
const Teacher = require('./models/Teacher');
const Student = require('./models/Student');

const run = async () => {
  await connectDB();

  const salt = await bcrypt.genSalt(10);
  const defaultPasswordHash = await bcrypt.hash('123456', salt);

  // --- Admin user ---
  let adminUser = await User.findOne({ email: 'admin@test.com' });
  if (!adminUser) {
    adminUser = await User.create({
      name: 'Admin',
      email: 'admin@test.com',
      password: defaultPasswordHash,
      role: 'admin'
    });
    console.log('Created admin user: admin@test.com / 123456');
  } else {
    console.log('Admin user already exists');
  }

  // --- Sample teacher + teacher login ---
  let teacher = await Teacher.findOne({ employeeId: 'EMP001' });
  if (!teacher) {
    teacher = await Teacher.create({
      name: 'Dr. Kumar',
      employeeId: 'EMP001',
      email: 'kumar@college.edu',
      phone: '9876543210',
      department: 'Computer Science',
      designation: 'Professor',
      specialization: 'Artificial Intelligence',
      status: 'Active',
      students: 0,
      projects: 0
    });
    console.log('Created sample teacher: Dr. Kumar');
  }

  let teacherUser = await User.findOne({ email: 'teacher@test.com' });
  if (!teacherUser) {
    teacherUser = await User.create({
      name: teacher.name,
      email: 'teacher@test.com',
      password: defaultPasswordHash,
      role: 'teacher',
      referenceId: teacher._id,
      referenceModel: 'Teacher'
    });
    console.log('Created teacher user: teacher@test.com / 123456');
  } else {
    console.log('Teacher user already exists');
  }

  // --- Sample student + student login ---
  let student = await Student.findOne({ registerNumber: 'CSE2026001' });
  if (!student) {
    student = await Student.create({
      name: 'Praneeth',
      registerNumber: 'CSE2026001',
      email: 'praneeth@student.com',
      phone: '',
      department: 'Computer Science',
      year: 'Final Year',
      status: 'Pending',
      project: 'Not Assigned'
    });
    console.log('Created sample student: Praneeth');
  }

  let studentUser = await User.findOne({ email: 'student@test.com' });
  if (!studentUser) {
    studentUser = await User.create({
      name: student.name,
      email: 'student@test.com',
      password: defaultPasswordHash,
      role: 'student',
      referenceId: student._id,
      referenceModel: 'Student'
    });
    console.log('Created student user: student@test.com / 123456');
  } else {
    console.log('Student user already exists');
  }

  console.log('\nSeeding complete.');
  process.exit(0);
};

run().catch((err) => {
  console.error('Seeding failed:', err);
  process.exit(1);
});
