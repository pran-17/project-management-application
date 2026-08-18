import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TeacherSidebar } from '../../shared/teacher-sidebar/teacher-sidebar';
import { Header } from '../../shared/header/header';

interface Submission {
  id: number;
  studentName: string;
  registerNumber: string;
  projectName: string;
  module: string;
  taskTitle: string;
  phase: string;
  submittedDate: string;
  progress: number;
  workDescription: string;
  studentRemark: string;
  status: 'Under Review' | 'Approved' | 'Changes Requested';
}

@Component({
  selector: 'app-review',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    TeacherSidebar,
    Header
  ],
  templateUrl: './review.html',
  styleUrl: './review.css'
})
export class Review {

  selectedSubmission: Submission | null = null;

  teacherRemark = '';

  reviewMessage = '';

  filter = 'All';


  submissions: Submission[] = [

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

      submittedDate:
        '13 Aug 2026',

      progress: 100,

      workDescription:
        'Completed the login page, role-based navigation and authentication interface. Added student and teacher login screens and connected the navigation flow.',

      studentRemark:
        'Authentication UI has been completed. Please review the implementation.',

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

      submittedDate:
        '12 Aug 2026',

      progress: 90,

      workDescription:
        'Implemented login API, user validation and JWT authentication.',

      studentRemark:
        'API development is almost complete. Please check the authentication flow.',

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
        'Phase 2 - Development',

      submittedDate:
        '10 Aug 2026',

      progress: 100,

      workDescription:
        'Created database collections for students, teachers, projects, teams and tasks.',

      studentRemark:
        'Database structure is completed.',

      status:
        'Approved'
    }

  ];


  get filteredSubmissions(): Submission[] {

    if (this.filter === 'All') {

      return this.submissions;

    }

    return this.submissions.filter(
      submission =>
        submission.status === this.filter
    );

  }


  openSubmission(
    submission: Submission
  ): void {

    this.selectedSubmission = submission;

    this.teacherRemark = '';

    this.reviewMessage = '';

  }


  closeSubmission(): void {

    this.selectedSubmission = null;

    this.teacherRemark = '';

    this.reviewMessage = '';

  }


  approveSubmission(): void {

    if (!this.selectedSubmission) {
      return;
    }


    if (!this.teacherRemark.trim()) {

      this.reviewMessage =
        'Please enter a teacher remark before approving the work.';

      return;

    }


    this.selectedSubmission.status =
      'Approved';


    this.reviewMessage =
      'Work approved successfully.';

  }


  requestChanges(): void {

    if (!this.selectedSubmission) {
      return;
    }


    if (!this.teacherRemark.trim()) {

      this.reviewMessage =
        'Please enter the changes required from the student.';

      return;

    }


    this.selectedSubmission.status =
      'Changes Requested';


    this.reviewMessage =
      'Changes requested successfully.';

  }


  getStatusClass(
    status: string
  ): string {

    switch (status) {

      case 'Approved':
        return 'approved';

      case 'Changes Requested':
        return 'changes';

      default:
        return 'review';

    }

  }


  getReviewCount(): number {

    return this.submissions.filter(
      submission =>
        submission.status === 'Under Review'
    ).length;

  }


  getApprovedCount(): number {

    return this.submissions.filter(
      submission =>
        submission.status === 'Approved'
    ).length;

  }


  getChangesCount(): number {

    return this.submissions.filter(
      submission =>
        submission.status === 'Changes Requested'
    ).length;

  }

}