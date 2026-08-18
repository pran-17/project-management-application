import { Component } from '@angular/core';
import { Sidebar } from '../../shared/sidebar/sidebar';
import { Header } from '../../shared/header/header';

@Component({
  selector: 'app-student-dashboard',
  standalone: true,
  imports: [
    Sidebar,
    Header
  ],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css'
})
export class Dashboard {

  studentName = 'Praneeth';

  project = {
    title: 'AI-Based Attendance Management System',
    type: 'Team Project',
    guide: 'Dr. Kumar',
    progress: 68,
    currentPhase: 'Phase 2',
    teamMembers: 4,
    pendingReviews: 2
  };


  stats = [
    {
      title: 'Project Progress',
      value: '68%',
      description: 'Overall completion',
      icon: '◔'
    },
    {
      title: 'Current Phase',
      value: 'Phase 2',
      description: 'Development',
      icon: '◫'
    },
    {
      title: 'Team Members',
      value: '4',
      description: 'Active members',
      icon: '👥'
    },
    {
      title: 'Pending Reviews',
      value: '2',
      description: 'Waiting for teacher',
      icon: '◷'
    }
  ];


  timeline = [
    {
      title: 'Project Proposal',
      date: '10 June 2026',
      status: 'completed'
    },
    {
      title: 'Phase 1 - Research & Planning',
      date: '30 June 2026',
      status: 'completed'
    },
    {
      title: 'Phase 2 - Development',
      date: 'Current Phase',
      status: 'current'
    },
    {
      title: 'Phase 3 - Testing',
      date: 'September 2026',
      status: 'upcoming'
    },
    {
      title: 'Final Submission',
      date: 'November 2026',
      status: 'upcoming'
    }
  ];


  recentUpdates = [
    {
      task: 'Login Module',
      description: 'JWT authentication interface completed',
      date: 'Today',
      status: 'Pending Review'
    },
    {
      task: 'Database Design',
      description: 'MongoDB collections designed',
      date: 'Yesterday',
      status: 'Approved'
    },
    {
      task: 'Student Dashboard',
      description: 'Dashboard UI implementation completed',
      date: '08 Aug 2026',
      status: 'Approved'
    }
  ];


  teacherRemarks = [
    {
      teacher: 'Dr. Kumar',
      remark: 'Good progress on the development phase.',
      date: 'Today'
    },
    {
      teacher: 'Dr. Kumar',
      remark: 'Database design has been approved.',
      date: 'Yesterday'
    }
  ];

}