const { askOllama } = require('../src/services/ollamaService');

const User = require('../models/User');
const Student = require('../models/Student');
const Teacher = require('../models/Teacher');
const Project = require('../models/Project');
const ResearchProject = require('../models/ResearchProject');

// These models may not exist yet.
// The chatbot will continue working if they are not available.
let Task = null;
let ProjectPhase = null;

try {
  Task = require('../models/Task');
} catch (error) {
  console.log('Task model not found. Task AI data will be skipped.');
}

try {
  ProjectPhase = require('../models/ProjectPhase');
} catch (error) {
  console.log('ProjectPhase model not found. Phase AI data will be skipped.');
}


/* =========================================================
   HELPERS
========================================================= */

const normalize = (value = '') => {
  return String(value).toLowerCase().trim();
};

const isQuestion = (message, words) => {
  const question = normalize(message);

  return words.some((word) => question.includes(normalize(word)));
};


/* =========================================================
   ROLE CHECK
========================================================= */

const getRole = (req) => {
  return normalize(req.user?.role);
};


/* =========================================================
   STUDENT LOOKUP
========================================================= */

const getLoggedInStudent = async (req) => {
  if (!req.user?.referenceId) {
    return null;
  }

  return await Student.findById(req.user.referenceId);
};


/* =========================================================
   TEACHER LOOKUP
========================================================= */

const getLoggedInTeacher = async (req) => {
  if (!req.user?.referenceId) {
    return null;
  }

  return await Teacher.findById(req.user.referenceId);
};


/* =========================================================
   GET TEACHER'S ASSIGNED STUDENTS
========================================================= */

const getTeacherStudents = async (teacherId) => {
  if (!teacherId) {
    return [];
  }

  return await Student.find({
    guide: teacherId
  })
    .select(
      'name registerNumber email phone department year status guide guideName project'
    )
    .sort({ name: 1 })
    .lean();
};


/* =========================================================
   GET STUDENT IDS
========================================================= */

const getStudentIds = (students) => {
  return students.map((student) => student._id);
};


/* =========================================================
   GET TEACHER PROJECTS
========================================================= */

const getTeacherProjects = async (teacherId, students) => {
  const studentIds = getStudentIds(students);

  const conditions = [];

  // Projects where teacher is guide
  conditions.push({
    guide: teacherId
  });

  // Projects containing assigned students
  if (studentIds.length > 0) {
    conditions.push({
      students: { $in: studentIds }
    });

    conditions.push({
      'teamMembers.student': { $in: studentIds }
    });
  }

  return await Project.find({
    $or: conditions
  })
    .sort({ createdAt: -1 })
    .lean();
};


/* =========================================================
   GET TEACHER TASKS
========================================================= */

const getTeacherTasks = async (teacherId, students) => {
  if (!Task || !students.length) {
    return [];
  }

  const studentIds = getStudentIds(students);

  return await Task.find({
    $or: [
      {
        guide: teacherId
      },
      {
        student: { $in: studentIds }
      }
    ]
  })
    .sort({ updatedAt: -1 })
    .lean();
};


/* =========================================================
   GET TEACHER RESEARCH
========================================================= */

const getTeacherResearch = async (teacherId) => {
  return await ResearchProject.find({
    $or: [
      { principalInvestigatorId: teacherId },
      { teachers: teacherId }
    ]
  })
    .sort({ createdAt: -1 })
    .lean();
};


/* =========================================================
   GET TEACHER PHASES
========================================================= */

const getTeacherPhases = async (teacher) => {
  if (!ProjectPhase || !teacher?.department) {
    return [];
  }

  return await ProjectPhase.find({
    department: teacher.department
  })
    .sort({ phaseNumber: 1 })
    .lean();
};


/* =========================================================
   GET STUDENT PROJECTS
========================================================= */

const getStudentProjects = async (student) => {
  if (!student) {
    return [];
  }

  const conditions = [
    {
      students: student._id
    },
    {
      'teamMembers.student': student._id
    }
  ];

  return await Project.find({
    $or: conditions
  })
    .sort({ createdAt: -1 })
    .lean();
};


/* =========================================================
   GET STUDENT TASKS
========================================================= */

const getStudentTasks = async (student) => {
  if (!Task || !student) {
    return [];
  }

  return await Task.find({
    student: student._id
  })
    .sort({ updatedAt: -1 })
    .lean();
};


/* =========================================================
   GET STUDENT RESEARCH
========================================================= */

const getStudentResearch = async (student) => {
  if (!student) {
    return [];
  }

  return await ResearchProject.find({
    'teamMembers.student': student._id
  })
    .sort({ createdAt: -1 })
    .lean();
};


/* =========================================================
   GET STUDENT PHASES
========================================================= */

const getStudentPhases = async (student) => {
  if (!ProjectPhase || !student?.department) {
    return [];
  }

  return await ProjectPhase.find({
    department: student.department
  })
    .sort({ phaseNumber: 1 })
    .lean();
};


/* =========================================================
   ADMIN DIRECT ANSWERS
========================================================= */

const getAdminDirectAnswer = async (question) => {

  /* ---------- TEACHER LIST ---------- */

  if (
    isQuestion(question, [
      'show teachers',
      'show me teachers',
      'show all teachers',
      'list teachers',
      'list all teachers',
      'display teachers',
      'display all teachers',
      'teacher list'
    ])
  ) {
    const teachers = await Teacher.find()
      .select(
        'name employeeId email phone department designation specialization status'
      )
      .sort({ name: 1 })
      .lean();

    if (!teachers.length) {
      return 'There are currently no teachers in the system.';
    }

    let answer = `There are ${teachers.length} teachers in the system:\n\n`;

    teachers.forEach((teacher, index) => {
      answer += `${index + 1}. ${teacher.name}\n`;

      if (teacher.employeeId) {
        answer += `   Employee ID: ${teacher.employeeId}\n`;
      }

      if (teacher.email) {
        answer += `   Email: ${teacher.email}\n`;
      }

      if (teacher.phone) {
        answer += `   Phone: ${teacher.phone}\n`;
      }

      if (teacher.department) {
        answer += `   Department: ${teacher.department}\n`;
      }

      if (teacher.designation) {
        answer += `   Designation: ${teacher.designation}\n`;
      }

      answer += '\n';
    });

    return answer.trim();
  }


  /* ---------- STUDENT LIST ---------- */

  if (
    isQuestion(question, [
      'show students',
      'show me students',
      'show all students',
      'list students',
      'list all students',
      'display students',
      'display all students',
      'student list'
    ])
  ) {
    const students = await Student.find()
      .select(
        'name registerNumber email phone department year status guideName project'
      )
      .sort({ name: 1 })
      .lean();

    if (!students.length) {
      return 'There are currently no students in the system.';
    }

    let answer = `There are ${students.length} students in the system:\n\n`;

    students.forEach((student, index) => {
      answer += `${index + 1}. ${student.name}\n`;

      if (student.registerNumber) {
        answer += `   Register Number: ${student.registerNumber}\n`;
      }

      if (student.email) {
        answer += `   Email: ${student.email}\n`;
      }

      if (student.department) {
        answer += `   Department: ${student.department}\n`;
      }

      if (student.year) {
        answer += `   Year: ${student.year}\n`;
      }

      if (student.guideName) {
        answer += `   Guide: ${student.guideName}\n`;
      }

      answer += '\n';
    });

    return answer.trim();
  }


  /* ---------- TEACHER COUNT ---------- */

  if (
    isQuestion(question, [
      'how many teachers',
      'number of teachers',
      'teacher count',
      'total teachers',
      'count of teachers'
    ])
  ) {
    const count = await Teacher.countDocuments();

    return `There are ${count} teachers in the system.`;
  }


  /* ---------- STUDENT COUNT ---------- */

  if (
    isQuestion(question, [
      'how many students',
      'number of students',
      'student count',
      'total students',
      'count of students'
    ])
  ) {
    const count = await Student.countDocuments();

    return `There are ${count} students in the system.`;
  }


  /* ---------- TEACHERS WITH ASSIGNED STUDENTS ---------- */

  if (
    isQuestion(question, [
      'teachers with students',
      'teachers with assigned students',
      'teachers and their students',
      'teachers with students assigned',
      'show teachers with students'
    ])
  ) {
    const teachers = await Teacher.find()
      .select(
        'name employeeId email department designation specialization status'
      )
      .sort({ name: 1 })
      .lean();

    if (!teachers.length) {
      return 'There are currently no teachers in the system.';
    }

    let answer = `There are ${teachers.length} teachers:\n\n`;

    for (const [index, teacher] of teachers.entries()) {

      answer += `${index + 1}. ${teacher.name}`;

      if (teacher.employeeId) {
        answer += ` | Employee ID: ${teacher.employeeId}`;
      }

      if (teacher.department) {
        answer += ` | Department: ${teacher.department}`;
      }

      answer += '\n';

      const students = await Student.find({
        guide: teacher._id
      })
        .select('name registerNumber department year status project')
        .sort({ name: 1 })
        .lean();

      if (!students.length) {
        answer += `   Students assigned: 0\n\n`;
        continue;
      }

      answer += `   Students assigned: ${students.length}\n`;

      students.forEach((student, studentIndex) => {
        answer += `   ${studentIndex + 1}. ${student.name}`;

        if (student.registerNumber) {
          answer += ` | Register No: ${student.registerNumber}`;
        }

        if (student.department) {
          answer += ` | Department: ${student.department}`;
        }

        answer += '\n';
      });

      answer += '\n';
    }

    return answer.trim();
  }


  return null;
};


/* =========================================================
   TEACHER DIRECT ANSWERS
========================================================= */

const getTeacherDirectAnswer = async (question, teacher) => {

  const students = await getTeacherStudents(teacher._id);

  /* ---------- MY STUDENTS ---------- */

  if (
    isQuestion(question, [
      'my students',
      'students assigned to me',
      'students under me',
      'students i guide',
      'students guided by me',
      'show my students',
      'list my students',
      'show students assigned to me'
    ])
  ) {
    if (!students.length) {
      return 'You currently do not have any students assigned to you.';
    }

    let answer = `You currently have ${students.length} assigned student${students.length === 1 ? '' : 's'}:\n\n`;

    students.forEach((student, index) => {
      answer += `${index + 1}. ${student.name}\n`;

      if (student.registerNumber) {
        answer += `   Register Number: ${student.registerNumber}\n`;
      }

      if (student.email) {
        answer += `   Email: ${student.email}\n`;
      }

      if (student.department) {
        answer += `   Department: ${student.department}\n`;
      }

      if (student.year) {
        answer += `   Year: ${student.year}\n`;
      }

      if (student.status) {
        answer += `   Status: ${student.status}\n`;
      }

      answer += '\n';
    });

    return answer.trim();
  }


  /* ---------- MY STUDENT COUNT ---------- */

  if (
    isQuestion(question, [
      'how many students are assigned to me',
      'how many students do i have',
      'my student count',
      'number of students assigned to me',
      'total students assigned to me'
    ])
  ) {
    return `You currently have ${students.length} student${students.length === 1 ? '' : 's'} assigned to you.`;
  }


  /* ---------- ALL STUDENTS BLOCK ---------- */

  if (
    isQuestion(question, [
      'show all students',
      'show every student',
      'list all students',
      'all students',
      'total students in college',
      'all student records'
    ])
  ) {
    return `You do not have permission to view all students. You can only access the ${students.length} student${students.length === 1 ? '' : 's'} assigned to you.`;
  }


  /* ---------- ALL TEACHERS BLOCK ---------- */

  if (
    isQuestion(question, [
      'show all teachers',
      'show teachers',
      'list all teachers',
      'all teachers',
      'teacher list',
      'all teacher records'
    ])
  ) {
    return 'You do not have permission to view the complete teacher list.';
  }


  /* ---------- STUDENT-SPECIFIC SEARCH ---------- */

  const mentionedStudent = students.find((student) => {
    const name = normalize(student.name);
    const registerNumber = normalize(student.registerNumber);

    return (
      (name && normalize(question).includes(name)) ||
      (registerNumber && normalize(question).includes(registerNumber))
    );
  });

  if (
    mentionedStudent &&
    isQuestion(question, [
      'show',
      'details',
      'information',
      'profile',
      'about',
      'project',
      'status',
      'progress',
      'task',
      'work',
      'email',
      'phone',
      'department'
    ])
  ) {
    let answer = `Student: ${mentionedStudent.name}\n`;

    if (mentionedStudent.registerNumber) {
      answer += `Register Number: ${mentionedStudent.registerNumber}\n`;
    }

    if (mentionedStudent.email) {
      answer += `Email: ${mentionedStudent.email}\n`;
    }

    if (mentionedStudent.phone) {
      answer += `Phone: ${mentionedStudent.phone}\n`;
    }

    if (mentionedStudent.department) {
      answer += `Department: ${mentionedStudent.department}\n`;
    }

    if (mentionedStudent.year) {
      answer += `Year: ${mentionedStudent.year}\n`;
    }

    if (mentionedStudent.status) {
      answer += `Status: ${mentionedStudent.status}\n`;
    }

    if (mentionedStudent.project) {
      answer += `Project: ${mentionedStudent.project}\n`;
    }

    return answer.trim();
  }


  return null;
};


/* =========================================================
   STUDENT DIRECT ANSWERS
========================================================= */

const getStudentDirectAnswer = async (question, student) => {

  /* ---------- ALL STUDENTS BLOCK ---------- */

  if (
    isQuestion(question, [
      'show all students',
      'show students',
      'list all students',
      'all students',
      'student list'
    ])
  ) {
    return 'You can only access your own student information.';
  }


  /* ---------- ALL TEACHERS BLOCK ---------- */

  if (
    isQuestion(question, [
      'show all teachers',
      'show teachers',
      'list all teachers',
      'all teachers',
      'teacher list'
    ])
  ) {
    return 'You do not have permission to view the teacher list.';
  }


  /* ---------- MY PROFILE ---------- */

  if (
    isQuestion(question, [
      'my profile',
      'my details',
      'my information',
      'show my profile',
      'show my details'
    ])
  ) {
    let answer = `Your Profile:\n\n`;

    answer += `Name: ${student.name}\n`;

    if (student.registerNumber) {
      answer += `Register Number: ${student.registerNumber}\n`;
    }

    if (student.email) {
      answer += `Email: ${student.email}\n`;
    }

    if (student.phone) {
      answer += `Phone: ${student.phone}\n`;
    }

    if (student.department) {
      answer += `Department: ${student.department}\n`;
    }

    if (student.year) {
      answer += `Year: ${student.year}\n`;
    }

    if (student.status) {
      answer += `Status: ${student.status}\n`;
    }

    if (student.guideName) {
      answer += `Guide: ${student.guideName}\n`;
    }

    if (student.project) {
      answer += `Project: ${student.project}\n`;
    }

    return answer.trim();
  }


  /* ---------- MY GUIDE ---------- */

  if (
    isQuestion(question, [
      'my guide',
      'my teacher',
      'my supervisor',
      'who is my guide'
    ])
  ) {
    if (!student.guide) {
      return 'You currently do not have a guide assigned.';
    }

    const teacher = await Teacher.findById(student.guide)
      .select('name employeeId email phone department designation specialization status')
      .lean();

    if (!teacher) {
      return 'Your guide information could not be found.';
    }

    let answer = `Your Guide:\n\n`;
    answer += `Name: ${teacher.name}\n`;

    if (teacher.employeeId) {
      answer += `Employee ID: ${teacher.employeeId}\n`;
    }

    if (teacher.email) {
      answer += `Email: ${teacher.email}\n`;
    }

    if (teacher.phone) {
      answer += `Phone: ${teacher.phone}\n`;
    }

    if (teacher.department) {
      answer += `Department: ${teacher.department}\n`;
    }

    if (teacher.designation) {
      answer += `Designation: ${teacher.designation}\n`;
    }

    return answer.trim();
  }


  /* ---------- MY TASK COUNT ---------- */

  if (
    isQuestion(question, [
      'my tasks',
      'my task count',
      'how many tasks do i have',
      'how many tasks'
    ])
  ) {
    if (!Task) {
      return 'Task information is not currently available.';
    }

    const count = await Task.countDocuments({
      student: student._id
    });

    return `You currently have ${count} task${count === 1 ? '' : 's'}.`;
  }


  /* ---------- MY PROJECTS ---------- */

  if (
    isQuestion(question, [
      'my project',
      'my projects',
      'show my project',
      'show my projects'
    ])
  ) {
    const projects = await getStudentProjects(student);

    if (!projects.length) {
      return 'You currently do not have any project records available.';
    }

    let answer = `You have ${projects.length} project${projects.length === 1 ? '' : 's'}:\n\n`;

    projects.forEach((project, index) => {
      answer += `${index + 1}. ${project.title || project.name || 'Untitled Project'}\n`;

      if (project.description) {
        answer += `   Description: ${project.description}\n`;
      }

      if (project.status) {
        answer += `   Status: ${project.status}\n`;
      }

      if (project.progress !== undefined) {
        answer += `   Progress: ${project.progress}%\n`;
      }

      answer += '\n';
    });

    return answer.trim();
  }


  return null;
};


/* =========================================================
   BUILD ADMIN AI CONTEXT
========================================================= */

const buildAdminContext = async () => {

  const students = await Student.find()
    .select(
      'name registerNumber email phone department year status guideName project'
    )
    .limit(100)
    .lean();

  const teachers = await Teacher.find()
    .select(
      'name employeeId email phone department designation specialization status'
    )
    .limit(100)
    .lean();

  const projects = await Project.find()
    .limit(100)
    .lean();

  const research = await ResearchProject.find()
    .limit(100)
    .lean();

  let tasks = [];

  if (Task) {
    tasks = await Task.find()
      .limit(200)
      .lean();
  }

  let phases = [];

  if (ProjectPhase) {
    phases = await ProjectPhase.find()
      .limit(100)
      .lean();
  }

  return {
    students,
    teachers,
    projects,
    research,
    tasks,
    phases
  };
};


/* =========================================================
   BUILD TEACHER AI CONTEXT
========================================================= */

const buildTeacherContext = async (teacher) => {

  const students = await getTeacherStudents(teacher._id);

  const projects = await getTeacherProjects(
    teacher._id,
    students
  );

  const tasks = await getTeacherTasks(
    teacher._id,
    students
  );

  const research = await getTeacherResearch(
    teacher._id
  );

  const phases = await getTeacherPhases(
    teacher
  );

  /*
   IMPORTANT:

   Only these records are passed to DeepSeek.

   Other students are NEVER included.
   Other teachers' students are NEVER included.
  */

  return {
    teacher: {
      _id: teacher._id,
      name: teacher.name,
      employeeId: teacher.employeeId,
      email: teacher.email,
      phone: teacher.phone,
      department: teacher.department,
      designation: teacher.designation,
      specialization: teacher.specialization,
      status: teacher.status
    },

    assignedStudents: students,

    relatedProjects: projects,

    relatedTasks: tasks,

    relatedResearch: research,

    departmentPhases: phases
  };
};


/* =========================================================
   BUILD STUDENT AI CONTEXT
========================================================= */

const buildStudentContext = async (student) => {

  const projects = await getStudentProjects(student);

  const tasks = await getStudentTasks(student);

  const research = await getStudentResearch(student);

  const phases = await getStudentPhases(student);

  let guide = null;

  if (student.guide) {
    guide = await Teacher.findById(student.guide)
      .select(
        'name employeeId email phone department designation specialization status'
      )
      .lean();
  }

  return {
    student: {
      _id: student._id,
      name: student.name,
      registerNumber: student.registerNumber,
      email: student.email,
      phone: student.phone,
      department: student.department,
      year: student.year,
      status: student.status,
      guideName: student.guideName,
      project: student.project
    },

    guide,

    ownProjects: projects,

    ownTasks: tasks,

    permittedResearch: research,

    departmentPhases: phases
  };
};


/* =========================================================
   BUILD AI PROMPT
========================================================= */

const buildPrompt = (question, role, context) => {

  let roleRules = '';

  if (role === 'admin') {

    roleRules = `
ROLE: ADMIN

The logged-in user is an administrator.

The administrator is allowed to access all project-management
information provided in the context.

The administrator may ask about:
- students
- teachers
- projects
- tasks
- work updates
- project phases
- research
- departments
- project progress
- teacher/student relationships

Use ONLY the supplied database context.

Do not invent database records.
`;
  }

  if (role === 'teacher') {

    roleRules = `
ROLE: TEACHER

The logged-in user is a teacher/guide.

STRICT ACCESS RULES:

1. The teacher may ONLY access students assigned to this teacher.
2. The teacher may ONLY access projects related to those students.
3. The teacher may ONLY access tasks/work belonging to those students.
4. The teacher may access research where the teacher is the PI/member.
5. The teacher may access project phases for the teacher's department.
6. NEVER reveal another teacher's students.
7. NEVER reveal the complete student database.
8. NEVER reveal the complete teacher database.
9. NEVER reveal students simply because they belong to the same college.
10. NEVER assume a student is assigned to the teacher.
11. Only the "assignedStudents" list supplied in the context defines accessible students.
12. If a requested student is not in assignedStudents, refuse access.
13. Do not reveal information outside the supplied context.

If the user asks:

"show all students"

respond:

"You do not have permission to view all students. You can only access students assigned to you."

If the user asks for another teacher's students:

"You do not have permission to access students assigned to another teacher."

If the question is unrelated to teacher supervision, assigned students,
projects, tasks, phases or research, respond:

"I can only help with information related to your teaching and assigned project supervision."
`;
  }

  if (role === 'student') {

    roleRules = `
ROLE: STUDENT

The logged-in user is a student.

STRICT ACCESS RULES:

1. The student may ONLY access their own information.
2. The student may access their own projects.
3. The student may access their own tasks/work.
4. The student may access their own guide information.
5. The student may access phases belonging to their department.
6. The student may access permitted research information supplied in context.
7. NEVER reveal another student's information.
8. NEVER reveal the complete student database.
9. NEVER reveal the complete teacher database.
10. NEVER reveal passwords or authentication information.

If information is not in the supplied context, do not invent it.
`;
  }


  return `
You are the AI assistant for a College Project Management System.

${roleRules}

========================================================
SECURITY
========================================================

The backend has already filtered the database according to the
logged-in user's role.

NEVER attempt to bypass backend authorization.

NEVER create or suggest MongoDB queries.

NEVER create SQL queries.

NEVER expose database implementation details.

NEVER expose JWT tokens.

NEVER expose passwords.

NEVER expose credentials.

NEVER invent information.

NEVER reveal information that is not present in the supplied context.

========================================================
ANSWER STYLE
========================================================

Answer naturally and clearly.

Do not return raw JSON.

Do not wrap normal answers in markdown code blocks.

Do not output MongoDB documents directly.

Convert database information into readable answers.

For lists, use numbered or bullet points.

Keep answers concise unless the user asks for details.

========================================================
USER QUESTION
========================================================

${question}

========================================================
AUTHORIZED DATABASE CONTEXT
========================================================

${JSON.stringify(context, null, 2)}

========================================================
FINAL RULE
========================================================

Answer the user's question using ONLY the authorized context above.
`;
};


/* =========================================================
   MAIN CHAT CONTROLLER
========================================================= */

const chatWithAI = async (req, res) => {

  try {

    const { message } = req.body;

    if (!message || !String(message).trim()) {
      return res.status(400).json({
        success: false,
        message: 'Message is required'
      });
    }

    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'Authentication required'
      });
    }

    const question = String(message).trim();

    const role = getRole(req);

    console.log('====================================');
    console.log('CHAT AUTHENTICATION CHECK');
    console.log('User ID:', req.user.id);
    console.log('Name:', req.user.name);
    console.log('Role:', role);
    console.log('Reference ID:', req.user.referenceId);
    console.log('Question:', question);
    console.log('====================================');


    /* =====================================================
       ADMIN
    ===================================================== */

    if (role === 'admin') {

      const directAnswer = await getAdminDirectAnswer(question);

      if (directAnswer) {

        console.log('>>> ADMIN DIRECT DATABASE ANSWER <<<');

        return res.json({
          success: true,
          message: directAnswer
        });
      }

      const context = await buildAdminContext();

      const prompt = buildPrompt(
        question,
        'admin',
        context
      );

      console.log('>>> ADMIN OLLAMA CALLED <<<');

      const answer = await askOllama(prompt);

      return res.json({
        success: true,
        message: answer
      });
    }


    /* =====================================================
       TEACHER
    ===================================================== */

    if (role === 'teacher') {

      const teacher = await getLoggedInTeacher(req);

      if (!teacher) {
        return res.status(404).json({
          success: false,
          message: 'Teacher profile not found'
        });
      }

      const directAnswer = await getTeacherDirectAnswer(
        question,
        teacher
      );

      if (directAnswer) {

        console.log('>>> TEACHER DIRECT DATABASE ANSWER <<<');

        return res.json({
          success: true,
          message: directAnswer
        });
      }

      /*
       * IMPORTANT:
       * Only teacher-authorized information is loaded here.
       */

      const context = await buildTeacherContext(
        teacher
      );

      const prompt = buildPrompt(
        question,
        'teacher',
        context
      );

      console.log('>>> TEACHER OLLAMA CALLED <<<');

      const answer = await askOllama(prompt);

      return res.json({
        success: true,
        message: answer
      });
    }


    /* =====================================================
       STUDENT
    ===================================================== */

    if (role === 'student') {

      const student = await getLoggedInStudent(req);

      if (!student) {
        return res.status(404).json({
          success: false,
          message: 'Student profile not found'
        });
      }

      const directAnswer = await getStudentDirectAnswer(
        question,
        student
      );

      if (directAnswer) {

        console.log('>>> STUDENT DIRECT DATABASE ANSWER <<<');

        return res.json({
          success: true,
          message: directAnswer
        });
      }

      /*
       * IMPORTANT:
       * Only student's own information is loaded here.
       */

      const context = await buildStudentContext(
        student
      );

      const prompt = buildPrompt(
        question,
        'student',
        context
      );

      console.log('>>> STUDENT OLLAMA CALLED <<<');

      const answer = await askOllama(prompt);

      return res.json({
        success: true,
        message: answer
      });
    }


    /* =====================================================
       UNKNOWN ROLE
    ===================================================== */

    return res.status(403).json({
      success: false,
      message: 'Unsupported user role'
    });

  } catch (error) {

    console.error('====================================');
    console.error('CHAT CONTROLLER ERROR');
    console.error(error);
    console.error('====================================');

    return res.status(500).json({
      success: false,
      message: 'Unable to process your request'
    });
  }
};


module.exports = {
  chatWithAI
};