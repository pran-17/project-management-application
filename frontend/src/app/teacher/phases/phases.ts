import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

import { TeacherSidebar } from '../../shared/teacher-sidebar/teacher-sidebar';
import { Header } from '../../shared/header/header';


interface Phase {

  id: number;

  number: number;

  name: string;

  description: string;

  progress: number;

  status:
    | 'Completed'
    | 'In Progress'
    | 'Pending';

  startDate: string;

  dueDate: string;

  studentsCompleted: number;

  totalStudents: number;

}


interface PhaseSubmission {

  id: number;

  studentName: string;

  registerNumber: string;

  projectName: string;

  phase: string;

  task: string;

  progress: number;

  submittedDate: string;

  status:
    | 'Under Review'
    | 'Approved'
    | 'Changes Requested';

}


@Component({

  selector: 'app-phases',

  standalone: true,

  imports: [
    CommonModule,
    FormsModule,
    RouterModule,
    TeacherSidebar,
    Header
  ],

  templateUrl: './phases.html',

  styleUrl: './phases.css'

})
export class Phases {


  selectedPhase: Phase | null = null;


  teacherRemark = '';

  message = '';


  phases: Phase[] = [

    {

      id: 1,

      number: 1,

      name: 'Research & Planning',

      description:
        'Requirement analysis, literature survey, problem identification and project planning.',

      progress: 100,

      status: 'Completed',

      startDate: '01 July 2026',

      dueDate: '15 July 2026',

      studentsCompleted: 24,

      totalStudents: 24

    },


    {

      id: 2,

      number: 2,

      name: 'Development',

      description:
        'Frontend, backend, database and core application development.',

      progress: 68,

      status: 'In Progress',

      startDate: '16 July 2026',

      dueDate: '31 August 2026',

      studentsCompleted: 12,

      totalStudents: 24

    },


    {

      id: 3,

      number: 3,

      name: 'Testing',

      description:
        'Application testing, bug fixing, validation and performance testing.',

      progress: 20,

      status: 'In Progress',

      startDate: '01 September 2026',

      dueDate: '15 September 2026',

      studentsCompleted: 4,

      totalStudents: 24

    },


    {

      id: 4,

      number: 4,

      name: 'Final Submission',

      description:
        'Documentation, final presentation, demonstration and project submission.',

      progress: 0,

      status: 'Pending',

      startDate: '16 September 2026',

      dueDate: '30 September 2026',

      studentsCompleted: 0,

      totalStudents: 24

    }

  ];


  submissions: PhaseSubmission[] = [

    {

      id: 1,

      studentName: 'Praneeth',

      registerNumber: 'CSE2026001',

      projectName:
        'AI-Based Attendance Management System',

      phase:
        'Phase 2 - Development',

      task:
        'Authentication UI',

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

      phase:
        'Phase 2 - Development',

      task:
        'Authentication API',

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
        'Library Management System',

      phase:
        'Phase 1 - Research & Planning',

      task:
        'Requirement Analysis',

      progress: 100,

      submittedDate:
        '10 Aug 2026',

      status:
        'Approved'

    }

  ];


  get completedPhases(): number {

    return this.phases.filter(
      phase => phase.status === 'Completed'
    ).length;

  }


  get activePhases(): number {

    return this.phases.filter(
      phase => phase.status === 'In Progress'
    ).length;

  }


  get pendingPhases(): number {

    return this.phases.filter(
      phase => phase.status === 'Pending'
    ).length;

  }


  openPhase(phase: Phase): void {

    this.selectedPhase = phase;

    this.teacherRemark = '';

    this.message = '';

  }


  closePhase(): void {

    this.selectedPhase = null;

    this.teacherRemark = '';

    this.message = '';

  }


  approvePhase(): void {

    if (!this.selectedPhase) {
      return;
    }


    if (!this.teacherRemark.trim()) {

      this.message =
        'Please enter a teacher remark before approving the phase.';

      return;

    }


    this.selectedPhase.status =
      'Completed';


    this.selectedPhase.progress =
      100;


    this.message =
      'Project phase approved successfully.';

  }


  requestChanges(): void {

    if (!this.selectedPhase) {
      return;
    }


    if (!this.teacherRemark.trim()) {

      this.message =
        'Please enter the changes required from the students.';

      return;

    }


    this.message =
      'Changes requested successfully.';

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


  getSubmissionClass(
    status: string
  ): string {

    if (status === 'Approved') {

      return 'approved';

    }

    if (
      status === 'Changes Requested'
    ) {

      return 'changes';

    }

    return 'review';

  }

}