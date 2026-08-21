import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { AdminSidebar } from '../../shared/admin-sidebar/admin-sidebar';
import { Header } from '../../shared/header/header';

@Component({
  selector: 'app-admin-projects',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    AdminSidebar,
    Header
  ],
  templateUrl: './projects.html',
  styleUrl: './projects.css'
})
export class Projects {

  showAddProject = false;

  newProject = {
    title: '',
    department: '',
    guide: '',
    status: 'Not Started'
  };

  projects = [
    {
      id: 'PRJ001',
      title: 'AI-Based Attendance Management System',
      department: 'Computer Science',
      guide: 'Dr. Kumar',
      students: ['Praneeth', 'Rahul', 'Arun', 'Karthik'],
      status: 'In Progress',
      progress: 68
    },
    {
      id: 'PRJ002',
      title: 'IoT-Based Smart Campus System',
      department: 'Computer Science',
      guide: 'Dr. Rajesh',
      students: ['Vijay', 'Suresh', 'Manoj'],
      status: 'In Progress',
      progress: 45
    },
    {
      id: 'PRJ003',
      title: 'Smart Library Management System',
      department: 'Information Technology',
      guide: 'Dr. Meena',
      students: ['Arun Kumar', 'Ravi'],
      status: 'Not Started',
      progress: 10
    },
    {
      id: 'PRJ004',
      title: 'Machine Learning Academic Prediction',
      department: 'Computer Science',
      guide: 'Dr. Priya',
      students: ['Naveen', 'Akash', 'Deepak'],
      status: 'Completed',
      progress: 100
    }
  ];

  guides = [
    'Dr. Kumar',
    'Dr. Priya',
    'Dr. Rajesh',
    'Dr. Meena'
  ];

  addProject() {

    if (
      !this.newProject.title ||
      !this.newProject.department ||
      !this.newProject.guide
    ) {
      alert('Please fill all required fields.');
      return;
    }

    const project = {
      id: 'PRJ00' + (this.projects.length + 1),
      title: this.newProject.title,
      department: this.newProject.department,
      guide: this.newProject.guide,
      students: [],
      status: this.newProject.status,
      progress: 0
    };

    this.projects.unshift(project);

    this.newProject = {
      title: '',
      department: '',
      guide: '',
      status: 'Not Started'
    };

    this.showAddProject = false;

    alert('Project created successfully.');
  }

  deleteProject(project: any) {

    const confirmed = confirm(
      `Are you sure you want to delete "${project.title}"?`
    );

    if (confirmed) {

      this.projects = this.projects.filter(
        item => item.id !== project.id
      );

    }
  }

  getStatusClass(status: string) {

    if (status === 'Completed') {
      return 'completed';
    }

    if (status === 'In Progress') {
      return 'progress';
    }

    return 'not-started';
  }
}