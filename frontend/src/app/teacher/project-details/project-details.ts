import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

import { TeacherSidebar } from '../../shared/teacher-sidebar/teacher-sidebar';
import { Header } from '../../shared/header/header';

interface TeamMember {
  name: string;
  registerNumber: string;
  role: string;
  module: string;
  progress: number;
  status: string;
}

interface ProjectPhase {
  number: number;
  name: string;
  description: string;
  progress: number;
  status: 'Completed' | 'In Progress' | 'Pending';
  completedDate: string;
}

@Component({
  selector: 'app-project-details',
  standalone: true,

  imports: [
    CommonModule,
    RouterModule,
    TeacherSidebar,
    Header
  ],

  templateUrl: './project-details.html',
  styleUrl: './project-details.css'
})
export class ProjectDetails {

  project = {

    id: 1,

    name:
      'AI-Based Attendance Management System',

    projectType:
      'Team Project',

    category:
      'Web Application',

    guide:
      'Dr. Kumar',

    department:
      'Computer Science and Engineering',

    startDate:
      '01 July 2026',

    expectedDate:
      '30 September 2026',

    overallProgress:
      75,

    currentPhase:
      'Phase 2 - Development',

    description:
      'A web-based attendance management system that helps institutions manage student attendance, teacher records and attendance reports using a centralized application.',

    objectives: [
      'Provide secure student and teacher login',
      'Record and manage student attendance',
      'Generate attendance reports',
      'Provide role-based access',
      'Reduce manual attendance work'
    ]

  };


  teamMembers: TeamMember[] = [

    {
      name: 'Praneeth',
      registerNumber: 'CSE2026001',
      role: 'Frontend Developer',
      module: 'Authentication & Dashboard',
      progress: 100,
      status: 'Completed'
    },

    {
      name: 'Rahul',
      registerNumber: 'CSE2026002',
      role: 'Backend Developer',
      module: 'Authentication API',
      progress: 90,
      status: 'In Progress'
    },

    {
      name: 'Karthik',
      registerNumber: 'CSE2026004',
      role: 'Database Developer',
      module: 'Database Design',
      progress: 80,
      status: 'In Progress'
    },

    {
      name: 'Arun',
      registerNumber: 'CSE2026003',
      role: 'Testing',
      module: 'Application Testing',
      progress: 45,
      status: 'In Progress'
    }

  ];


  phases: ProjectPhase[] = [

    {
      number: 1,

      name:
        'Research & Planning',

      description:
        'Requirement analysis, literature survey and project planning.',

      progress: 100,

      status: 'Completed',

      completedDate:
        '15 July 2026'
    },

    {
      number: 2,

      name:
        'Development',

      description:
        'Frontend, backend and database development.',

      progress: 75,

      status: 'In Progress',

      completedDate:
        '-'
    },

    {
      number: 3,

      name:
        'Testing',

      description:
        'System testing, bug fixing and validation.',

      progress: 20,

      status: 'In Progress',

      completedDate:
        '-'
    },

    {
      number: 4,

      name:
        'Final Submission',

      description:
        'Documentation, presentation and final project submission.',

      progress: 0,

      status: 'Pending',

      completedDate:
        '-'
    }

  ];


  getPhaseClass(
    status: string
  ): string {

    switch (status) {

      case 'Completed':
        return 'completed';

      case 'In Progress':
        return 'active';

      default:
        return 'pending';

    }

  }


  getMemberStatusClass(
    status: string
  ): string {

    if (status === 'Completed') {
      return 'completed';
    }

    return 'active';

  }

}