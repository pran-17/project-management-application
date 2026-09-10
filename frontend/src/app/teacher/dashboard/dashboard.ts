import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

import { TeacherSidebar } from '../../shared/teacher-sidebar/teacher-sidebar';


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

  ],

  templateUrl: './dashboard.html',

  styleUrl: './dashboard.css'

})


export class Dashboard implements OnInit {

  // ==========================================
  // LOGGED-IN TEACHER DETAILS
  // ==========================================

  teacherName: string = 'Teacher';

  teacherDepartment: string = 'Department';


  // ==========================================
  // REVIEW SUBMISSIONS
  // ==========================================

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


  // ==========================================
  // COMPONENT INITIALIZATION
  // ==========================================

  ngOnInit(): void {

    this.loadTeacherDetails();

  }


  // ==========================================
  // LOAD LOGGED-IN TEACHER
  // ==========================================

  loadTeacherDetails(): void {

    const userData = sessionStorage.getItem('user');

    if (!userData) {
      return;
    }

    try {

      const user = JSON.parse(userData);

      this.teacherName =
        user.name || 'Teacher';

      this.teacherDepartment =
        user.department || 'Department';

    } catch (error) {

      console.error(
        'Unable to load teacher details:',
        error
      );

    }

  }


  // ==========================================
  // REVIEW COUNT
  // ==========================================

  getReviewCount(): number {

    return this.reviewSubmissions.filter(
      item => item.status === 'Under Review'
    ).length;

  }


  // ==========================================
  // APPROVED COUNT
  // ==========================================

  getApprovedCount(): number {

    return this.reviewSubmissions.filter(
      item => item.status === 'Approved'
    ).length;

  }


  // ==========================================
  // CHANGES REQUESTED COUNT
  // ==========================================

  getChangesCount(): number {

    return this.reviewSubmissions.filter(
      item => item.status === 'Changes Requested'
    ).length;

  }


  // ==========================================
  // STATUS CLASS
  // ==========================================

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