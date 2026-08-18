import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

import { TeacherSidebar } from '../../shared/teacher-sidebar/teacher-sidebar';
import { Header } from '../../shared/header/header';


interface ReviewSubmission {

  id: number;

  studentName: string;

  registerNumber: string;

  projectName: string;

  module: string;

  taskTitle: string;

  phase: string;

  progress: number;

  submittedDate: string;

  status:
    | 'Under Review'
    | 'Approved'
    | 'Changes Requested';

}


@Component({

  selector: 'app-dashboard',

  standalone: true,

  imports: [
    CommonModule,
    RouterModule,
    TeacherSidebar,
    Header
  ],

  templateUrl: './dashboard.html',

  styleUrl: './dashboard.css'

})
export class Dashboard {

  reviewSubmissions: ReviewSubmission[] = [

    {
      id: 1,

      studentName: 'Praneeth',

      registerNumber: 'CSE2026001',

      projectName:
        'AI-Based Attendance Management System',

      module:
        'Frontend Development',

      taskTitle:
        'Implement Authentication',

      phase:
        'Phase 2 - Development',

      progress: 100,

      submittedDate:
        '13 Aug 2026',

      status:
        'Under Review'
    },

    {
      id: 2,

      studentName: 'Rahul',

      registerNumber: 'CSE2026002',

      projectName:
        'AI-Based Attendance Management System',

      module:
        'Backend Development',

      taskTitle:
        'Authentication API',

      phase:
        'Phase 2 - Development',

      progress: 90,

      submittedDate:
        '12 Aug 2026',

      status:
        'Under Review'
    },

    {
      id: 3,

      studentName: 'Arun',

      registerNumber: 'CSE2026003',

      projectName:
        'AI-Based Attendance Management System',

      module:
        'Database Development',

      taskTitle:
        'Database Design',

      phase:
        'Phase 1 - Research & Planning',

      progress: 100,

      submittedDate:
        '10 Aug 2026',

      status:
        'Approved'
    }

  ];


  getReviewCount(): number {

    return this.reviewSubmissions.filter(
      item => item.status === 'Under Review'
    ).length;

  }


  getApprovedCount(): number {

    return this.reviewSubmissions.filter(
      item => item.status === 'Approved'
    ).length;

  }


  getChangesCount(): number {

    return this.reviewSubmissions.filter(
      item => item.status === 'Changes Requested'
    ).length;

  }


  getStatusClass(status: string): string {

    if (status === 'Approved') {
      return 'approved';
    }

    if (status === 'Changes Requested') {
      return 'changes';
    }

    return 'review';

  }

}