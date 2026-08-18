import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ActivatedRoute } from '@angular/router';

import { TeacherSidebar } from '../../shared/teacher-sidebar/teacher-sidebar';
import { Header } from '../../shared/header/header';


interface TeamMember {
  name: string;
  registerNumber: string;
  role: string;
}


interface WorkItem {
  id: number;
  title: string;
  module: string;
  phase: string;
  description: string;
  progress: number;
  completedDate: string;
  studentRemark: string;
  teacherRemark: string;
  status: 'Completed' | 'In Progress' | 'Changes Requested';
}


interface PhaseHistory {
  number: number;
  name: string;
  progress: number;
  status: 'Completed' | 'In Progress' | 'Pending';
  startDate: string;
  completedDate: string;
}


@Component({
  selector: 'app-student-details',

  standalone: true,

  imports: [
    CommonModule,
    RouterModule,
    TeacherSidebar,
    Header
  ],

  templateUrl: './student-details.html',

  styleUrl: './student-details.css'
})
export class StudentDetails {

  studentId = '';


  student = {

    id: 1,

    name: 'Praneeth',

    registerNumber: 'CSE2026001',

    email: 'praneeth@example.com',

    phone: '9876543210',

    department: 'Computer Science and Engineering',

    year: 'Final Year',

    projectName:
      'AI-Based Attendance Management System',

    projectType:
      'Team Project',

    role:
      'Frontend Developer',

    assignedModule:
      'Authentication & Dashboard',

    currentPhase:
      'Phase 2 - Development',

    overallProgress:
      100,

    projectStartDate:
      '01 July 2026',

    expectedCompletion:
      '30 September 2026',

    guide:
      'Dr. Kumar',

    projectStatus:
      'On Track'

  };


  teamMembers: TeamMember[] = [

    {
      name: 'Praneeth',
      registerNumber: 'CSE2026001',
      role: 'Frontend Developer'
    },

    {
      name: 'Rahul',
      registerNumber: 'CSE2026002',
      role: 'Backend Developer'
    },

    {
      name: 'Karthik',
      registerNumber: 'CSE2026004',
      role: 'Database Developer'
    },

    {
      name: 'Arun',
      registerNumber: 'CSE2026003',
      role: 'Testing'
    }

  ];


  phaseHistory: PhaseHistory[] = [

    {
      number: 1,
      name: 'Research & Planning',
      progress: 100,
      status: 'Completed',
      startDate: '01 July 2026',
      completedDate: '15 July 2026'
    },

    {
      number: 2,
      name: 'Development',
      progress: 100,
      status: 'Completed',
      startDate: '16 July 2026',
      completedDate: '13 Aug 2026'
    },

    {
      number: 3,
      name: 'Testing',
      progress: 20,
      status: 'In Progress',
      startDate: '14 Aug 2026',
      completedDate: '-'
    },

    {
      number: 4,
      name: 'Final Submission',
      progress: 0,
      status: 'Pending',
      startDate: '16 Sep 2026',
      completedDate: '-'
    }

  ];


  workItems: WorkItem[] = [

    {
      id: 1,

      title:
        'Login & Authentication UI',

      module:
        'Authentication & Dashboard',

      phase:
        'Phase 2 - Development',

      description:
        'Created student and teacher login screens and implemented role-based navigation interface.',

      progress: 100,

      completedDate:
        '13 Aug 2026',

      studentRemark:
        'Authentication UI has been completed. Please review the implementation.',

      teacherRemark:
        'Good implementation. Authentication screens are completed.',

      status:
        'Completed'
    },


    {
      id: 2,

      title:
        'Student Dashboard',

      module:
        'Authentication & Dashboard',

      phase:
        'Phase 2 - Development',

      description:
        'Implemented the student dashboard with attendance, marks, assignments and project information.',

      progress: 100,

      completedDate:
        '12 Aug 2026',

      studentRemark:
        'Dashboard layout and required student modules are completed.',

      teacherRemark:
        'Dashboard completed. Continue with testing.',

      status:
        'Completed'
    },


    {
      id: 3,

      title:
        'Dashboard Testing',

      module:
        'Authentication & Dashboard',

      phase:
        'Phase 3 - Testing',

      description:
        'Testing navigation, authentication and dashboard functionality.',

      progress: 35,

      completedDate:
        '-',

      studentRemark:
        'Initial testing has started. Some navigation issues are being checked.',

      teacherRemark:
        'Continue testing and fix the remaining navigation issues.',

      status:
        'In Progress'
    }

  ];


  constructor(
    private route: ActivatedRoute
  ) {}


  ngOnInit(): void {

    this.studentId =
      this.route.snapshot.paramMap.get('id') || '';

  }


  getCompletedWork(): number {

    return this.workItems.filter(
      item =>
        item.status === 'Completed'
    ).length;

  }


  getPendingWork(): number {

    return this.workItems.filter(
      item =>
        item.status !== 'Completed'
    ).length;

  }


  getPhaseClass(
    status: string
  ): string {

    if (status === 'Completed') {
      return 'completed';
    }

    if (status === 'In Progress') {
      return 'active';
    }

    return 'pending';

  }


  getWorkStatusClass(
    status: string
  ): string {

    if (status === 'Completed') {
      return 'completed';
    }

    if (status === 'Changes Requested') {
      return 'changes';
    }

    return 'active';

  }

}