import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

import { AdminSidebar } from '../../shared/admin-sidebar/admin-sidebar';

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    AdminSidebar
  ],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css'
})
export class Dashboard {

  adminName = 'Admin';

  stats = [
    {
      title: 'Total Students',
      value: '156',
      description: 'Registered students',
      icon: '👨‍🎓',
      link: '/admin/students'
    },
    {
      title: 'Total Teachers',
      value: '24',
      description: 'Active project guides',
      icon: '👨‍🏫',
      link: '/admin/teachers'
    },
    {
      title: 'Active Projects',
      value: '48',
      description: 'Projects in progress',
      icon: '📁',
      link: '/admin/projects'
    },
    {
      title: 'Unassigned Students',
      value: '12',
      description: 'Guide assignment pending',
      icon: '⚠',
      link: '/admin/assign-guide'
    }
  ];


  recentStudents = [
    {
      name: 'Praneeth',
      registerNumber: 'CSE2026001',
      department: 'Computer Science',
      status: 'Guide Assigned'
    },
    {
      name: 'Rahul',
      registerNumber: 'CSE2026002',
      department: 'Computer Science',
      status: 'Guide Assigned'
    },
    {
      name: 'Arun',
      registerNumber: 'CSE2026003',
      department: 'Information Technology',
      status: 'Pending Assignment'
    }
  ];


  recentProjects = [
    {
      title: 'AI-Based Attendance Management System',
      students: 4,
      guide: 'Dr. Kumar',
      progress: 68
    },
    {
      title: 'IoT-Based Smart Campus',
      students: 3,
      guide: 'Dr. Priya',
      progress: 45
    },
    {
      title: 'Machine Learning Academic Analysis',
      students: 2,
      guide: 'Dr. Kumar',
      progress: 100
    }
  ];

}