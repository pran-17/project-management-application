import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ActivatedRoute } from '@angular/router';

import { TeacherSidebar } from '../../shared/teacher-sidebar/teacher-sidebar';
import { Header } from '../../shared/header/header';

import { StudentService } from '../../services/student.service';
import { ProjectService } from '../../services/project.service';


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
export class StudentDetails implements OnInit {

  studentId = '';

  isLoading = false;


  student = {

    id: '',

    name: '',

    registerNumber: '',

    email: '',

    phone: '',

    department: '',

    year: '',

    projectName:
      'Not Assigned',

    projectType:
      'Individual',

    role:
      'Team Member',

    assignedModule:
      '-',

    currentPhase:
      '-',

    overallProgress:
      0,

    projectStartDate:
      '-',

    expectedCompletion:
      '-',

    guide:
      'Not Assigned',

    projectStatus:
      'On Track'

  };


  teamMembers: TeamMember[] = [];


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
    private route: ActivatedRoute,
    private studentService: StudentService,
    private projectService: ProjectService
  ) {}


  ngOnInit(): void {

    this.studentId =
      this.route.snapshot.paramMap.get('id') || '';

    if (!this.studentId) {
      return;
    }

    this.isLoading = true;

    this.studentService.getStudentById(this.studentId).subscribe({
      next: (s) => {
        this.student.id = s.id;
        this.student.name = s.name;
        this.student.registerNumber = s.registerNumber;
        this.student.email = s.email;
        this.student.phone = s.phone;
        this.student.department = s.department;
        this.student.year = s.year;
        this.student.guide = s.guide;
        this.student.projectName = s.project || 'Not Assigned';
        this.isLoading = false;

        // If this student belongs to a project, load the full team for the "Team Members" section
        this.projectService.getProjects().subscribe({
          next: (projects) => {
            const project = projects.find(p => p.students.includes(s.name));
            if (project) {
              this.teamMembers = project.students.map(name => ({
                name,
                registerNumber: name === s.name ? s.registerNumber : '-',
                role: name === s.name ? 'Team Member' : 'Team Member'
              }));
            }
          },
          error: (err) => console.error('Failed to load project team:', err)
        });
      },
      error: (err) => {
        this.isLoading = false;
        console.error('Failed to load student details:', err);
      }
    });

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