import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { AdminSidebar } from '../../shared/admin-sidebar/admin-sidebar';
import { Header } from '../../shared/header/header';

@Component({
  selector: 'app-assign-guide',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    AdminSidebar,
    Header
  ],
  templateUrl: './assign-guide.html',
  styleUrl: './assign-guide.css'
})
export class AssignGuide {

  selectedStudent = '';
  selectedGuide = '';

  students = [
    {
      id: 'CSE2026001',
      name: 'Praneeth',
      department: 'Computer Science',
      project: 'AI-Based Attendance Management System',
      guide: 'Dr. Kumar'
    },
    {
      id: 'CSE2026002',
      name: 'Rahul',
      department: 'Computer Science',
      project: 'IoT-Based Smart Campus',
      guide: 'Not Assigned'
    },
    {
      id: 'CSE2026003',
      name: 'Arun',
      department: 'Computer Science',
      project: 'Machine Learning for Academic Performance',
      guide: 'Dr. Kumar'
    },
    {
      id: 'CSE2026004',
      name: 'Karthik',
      department: 'Information Technology',
      project: 'Smart Library Management',
      guide: 'Not Assigned'
    }
  ];

  teachers = [
    {
      name: 'Dr. Kumar',
      department: 'Computer Science',
      specialization: 'Artificial Intelligence'
    },
    {
      name: 'Dr. Priya',
      department: 'Computer Science',
      specialization: 'Machine Learning'
    },
    {
      name: 'Dr. Rajesh',
      department: 'Information Technology',
      specialization: 'Internet of Things'
    },
    {
      name: 'Dr. Meena',
      department: 'Computer Science',
      specialization: 'Database Systems'
    }
  ];

  assignGuide() {

    if (!this.selectedStudent || !this.selectedGuide) {
      alert('Please select both student and project guide.');
      return;
    }

    const student = this.students.find(
      student => student.id === this.selectedStudent
    );

    if (student) {
      student.guide = this.selectedGuide;

      alert(
        `${this.selectedGuide} has been assigned as guide for ${student.name}.`
      );

      this.selectedStudent = '';
      this.selectedGuide = '';
    }
  }

  removeGuide(student: any) {

    const confirmed = confirm(
      `Remove ${student.guide} as guide for ${student.name}?`
    );

    if (confirmed) {
      student.guide = 'Not Assigned';
    }
  }
}