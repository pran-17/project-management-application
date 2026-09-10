import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AdminSidebar } from '../../shared/admin-sidebar/admin-sidebar';

@Component({
  selector: 'app-user-management',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    AdminSidebar
  ],
  templateUrl: './user-management.html',
  styleUrl: './user-management.css'
})
export class UserManagement {

  activeTab: 'students' | 'teachers' | 'assign' = 'students';

  studentName = '';
  studentEmail = '';
  studentRegisterNumber = '';
  studentDepartment = '';

  teacherName = '';
  teacherEmail = '';
  teacherEmployeeId = '';
  teacherDepartment = '';

  selectedStudentId = '';
  selectedTeacherId = '';

  students = [
    {
      id: 1,
      name: 'Praneeth',
      registerNumber: 'CSE2026001',
      email: 'praneeth@example.com',
      department: 'Computer Science',
      guideId: 1,
      guideName: 'Dr. Kumar'
    },
    {
      id: 2,
      name: 'Rahul',
      registerNumber: 'CSE2026002',
      email: 'rahul@example.com',
      department: 'Computer Science',
      guideId: 2,
      guideName: 'Dr. Priya'
    },
    {
      id: 3,
      name: 'Arun',
      registerNumber: 'CSE2026003',
      email: 'arun@example.com',
      department: 'Information Technology',
      guideId: 0,
      guideName: 'Not Assigned'
    }
  ];

  teachers = [
    {
      id: 1,
      name: 'Dr. Kumar',
      employeeId: 'EMP001',
      email: 'kumar@example.com',
      department: 'Computer Science'
    },
    {
      id: 2,
      name: 'Dr. Priya',
      employeeId: 'EMP002',
      email: 'priya@example.com',
      department: 'Computer Science'
    }
  ];

  showMessage = false;
  message = '';

  addStudent() {

    if (
      !this.studentName ||
      !this.studentEmail ||
      !this.studentRegisterNumber ||
      !this.studentDepartment
    ) {
      this.showNotification('Please fill all student details.');
      return;
    }

    const newStudent = {
      id: Date.now(),
      name: this.studentName,
      registerNumber: this.studentRegisterNumber,
      email: this.studentEmail,
      department: this.studentDepartment,
      guideId: 0,
      guideName: 'Not Assigned'
    };

    this.students.push(newStudent);

    this.studentName = '';
    this.studentEmail = '';
    this.studentRegisterNumber = '';
    this.studentDepartment = '';

    this.showNotification('Student added successfully.');
  }


  addTeacher() {

    if (
      !this.teacherName ||
      !this.teacherEmail ||
      !this.teacherEmployeeId ||
      !this.teacherDepartment
    ) {
      this.showNotification('Please fill all teacher details.');
      return;
    }

    const newTeacher = {
      id: Date.now(),
      name: this.teacherName,
      employeeId: this.teacherEmployeeId,
      email: this.teacherEmail,
      department: this.teacherDepartment
    };

    this.teachers.push(newTeacher);

    this.teacherName = '';
    this.teacherEmail = '';
    this.teacherEmployeeId = '';
    this.teacherDepartment = '';

    this.showNotification('Teacher added successfully.');
  }


  assignGuide() {

    if (!this.selectedStudentId || !this.selectedTeacherId) {
      this.showNotification('Please select both student and guide.');
      return;
    }

    const student = this.students.find(
      student => student.id === Number(this.selectedStudentId)
    );

    const teacher = this.teachers.find(
      teacher => teacher.id === Number(this.selectedTeacherId)
    );

    if (student && teacher) {

      student.guideId = teacher.id;
      student.guideName = teacher.name;

      this.showNotification(
        `${teacher.name} has been assigned as guide for ${student.name}.`
      );

      this.selectedStudentId = '';
      this.selectedTeacherId = '';
    }
  }


  deleteStudent(id: number) {

    this.students = this.students.filter(
      student => student.id !== id
    );

    this.showNotification('Student removed successfully.');
  }


  deleteTeacher(id: number) {

    this.teachers = this.teachers.filter(
      teacher => teacher.id !== id
    );

    this.students.forEach(student => {
      if (student.guideId === id) {
        student.guideId = 0;
        student.guideName = 'Not Assigned';
      }
    });

    this.showNotification('Teacher removed successfully.');
  }


  setActiveTab(tab: 'students' | 'teachers' | 'assign') {
    this.activeTab = tab;
  }


  showNotification(message: string) {

    this.message = message;
    this.showMessage = true;

    setTimeout(() => {
      this.showMessage = false;
    }, 3000);
  }
}