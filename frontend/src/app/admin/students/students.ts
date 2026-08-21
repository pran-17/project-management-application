import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AdminSidebar } from '../../shared/admin-sidebar/admin-sidebar';

@Component({
  selector: 'app-admin-students',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    AdminSidebar
  ],
  templateUrl: './students.html',
  styleUrl: './students.css'
})
export class Students {

  searchText = '';

  showAddStudent = false;

  students = [
    {
      id: 1,
      name: 'Praneeth',
      registerNumber: 'CSE2026001',
      email: 'praneeth@student.com',
      department: 'Computer Science',
      guide: 'Dr. Kumar',
      project: 'AI-Based Attendance Management System',
      status: 'Active'
    },
    {
      id: 2,
      name: 'Rahul',
      registerNumber: 'CSE2026002',
      email: 'rahul@student.com',
      department: 'Computer Science',
      guide: 'Dr. Kumar',
      project: 'AI-Based Attendance Management System',
      status: 'Active'
    },
    {
      id: 3,
      name: 'Arun',
      registerNumber: 'IT2026003',
      email: 'arun@student.com',
      department: 'Information Technology',
      guide: 'Not Assigned',
      project: 'Not Assigned',
      status: 'Pending'
    },
    {
      id: 4,
      name: 'Karthik',
      registerNumber: 'IT2026004',
      email: 'karthik@student.com',
      department: 'Information Technology',
      guide: 'Dr. Priya',
      project: 'IoT Smart Campus',
      status: 'Active'
    }
  ];

  newStudent = {
    name: '',
    registerNumber: '',
    email: '',
    department: ''
  };


  get filteredStudents() {

    const search = this.searchText.toLowerCase();

    return this.students.filter(student =>
      student.name.toLowerCase().includes(search) ||
      student.registerNumber.toLowerCase().includes(search) ||
      student.department.toLowerCase().includes(search)
    );

  }


  openAddStudent() {

    this.showAddStudent = true;

  }


  closeAddStudent() {

    this.showAddStudent = false;

    this.newStudent = {
      name: '',
      registerNumber: '',
      email: '',
      department: ''
    };

  }


  addStudent() {

    if (
      !this.newStudent.name ||
      !this.newStudent.registerNumber ||
      !this.newStudent.email ||
      !this.newStudent.department
    ) {
      return;
    }

    this.students.push({
      id: Date.now(),
      name: this.newStudent.name,
      registerNumber: this.newStudent.registerNumber,
      email: this.newStudent.email,
      department: this.newStudent.department,
      guide: 'Not Assigned',
      project: 'Not Assigned',
      status: 'Pending'
    });

    this.closeAddStudent();

  }


  deleteStudent(id: number) {

    this.students = this.students.filter(
      student => student.id !== id
    );

  }

}