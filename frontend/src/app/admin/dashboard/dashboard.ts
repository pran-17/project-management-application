import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { AdminSidebar } from '../../shared/admin-sidebar/admin-sidebar';

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [
    RouterLink,
    AdminSidebar
  ],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css'
})
export class Dashboard {

  adminName = 'Praneeth';

  stats = [
    {
      title: 'Total Students',
      value: '5',
      description: 'Registered students',
      icon: '👨‍🎓',
      link: '/admin/students'
    },
    {
      title: 'Total Teachers',
      value: '4',
      description: 'Available project guides',
      icon: '👨‍🏫',
      link: '/admin/teacher'
    },
    {
      title: 'Active Projects',
      value: '2',
      description: 'Projects currently running',
      icon: '▣',
      link: '/admin/projects'
    },
    {
      title: 'Pending Guides',
      value: '1',
      description: 'Students awaiting guide assignment',
      icon: '🔗',
      link: '/admin/assign-guide'
    }
  ];

  recentStudents = [
    {
      name: 'Praneeth',
      registerNumber: '21CS001',
      department: 'Computer Science',
      status: 'Assigned'
    },
    {
      name: 'Rahul',
      registerNumber: '21CS002',
      department: 'Information Technology',
      status: 'Assigned'
    },
    {
      name: 'Arun',
      registerNumber: '21CS003',
      department: 'Computer Science',
      status: 'Pending Assignment'
    },
    {
      name: 'Karthik',
      registerNumber: '21CS004',
      department: 'Artificial Intelligence',
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
      title: 'Smart Waste Management System',
      students: 3,
      guide: 'Dr. Priya',
      progress: 45
    },
    {
      title: 'Blockchain Certificate Verification',
      students: 4,
      guide: 'Dr. Raj',
      progress: 82
    }
  ];

}