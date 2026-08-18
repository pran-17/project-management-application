import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

import { TeacherSidebar } from '../../shared/teacher-sidebar/teacher-sidebar';
import { Header } from '../../shared/header/header';

interface Student {

  id: number;

  name: string;

  registerNumber: string;

  email: string;

  department: string;

  projectName: string;

  projectType: 'Team Project' | 'Individual';

  role: string;

  module: string;

  currentPhase: string;

  progress: number;

  status:
    | 'On Track'
    | 'Needs Attention'
    | 'Completed';

  lastUpdate: string;

}

@Component({

  selector: 'app-students',

  standalone: true,

  imports: [
    CommonModule,
    FormsModule,
    RouterModule,
    TeacherSidebar,
    Header
  ],

  templateUrl: './students.html',

  styleUrl: './students.css'

})
export class Students {


  searchText = '';

  projectFilter = 'All';

  statusFilter = 'All';


  students: Student[] = [

    {
      id: 1,

      name: 'Praneeth',

      registerNumber: 'CSE2026001',

      email: 'praneeth@example.com',

      department: 'Computer Science',

      projectName:
        'AI-Based Attendance Management System',

      projectType: 'Team Project',

      role: 'Frontend Developer',

      module:
        'Authentication & Dashboard',

      currentPhase:
        'Phase 2 - Development',

      progress: 100,

      status: 'On Track',

      lastUpdate:
        '13 Aug 2026'
    },


    {
      id: 2,

      name: 'Rahul',

      registerNumber: 'CSE2026002',

      email: 'rahul@example.com',

      department: 'Computer Science',

      projectName:
        'AI-Based Attendance Management System',

      projectType: 'Team Project',

      role: 'Backend Developer',

      module:
        'Authentication API',

      currentPhase:
        'Phase 2 - Development',

      progress: 90,

      status: 'On Track',

      lastUpdate:
        '12 Aug 2026'
    },


    {
      id: 3,

      name: 'Arun',

      registerNumber: 'CSE2026003',

      email: 'arun@example.com',

      department: 'Computer Science',

      projectName:
        'Library Management System',

      projectType: 'Individual',

      role: 'Full Stack Developer',

      module:
        'Complete Application',

      currentPhase:
        'Phase 3 - Testing',

      progress: 100,

      status: 'Completed',

      lastUpdate:
        '10 Aug 2026'
    },


    {
      id: 4,

      name: 'Karthik',

      registerNumber: 'CSE2026004',

      email: 'karthik@example.com',

      department: 'Computer Science',

      projectName:
        'AI-Based Attendance Management System',

      projectType: 'Team Project',

      role: 'Database Developer',

      module:
        'Database Design',

      currentPhase:
        'Phase 2 - Development',

      progress: 80,

      status: 'Needs Attention',

      lastUpdate:
        '09 Aug 2026'
    },


    {
      id: 5,

      name: 'Sanjay',

      registerNumber: 'CSE2026005',

      email: 'sanjay@example.com',

      department: 'Computer Science',

      projectName:
        'Smart Parking System',

      projectType: 'Individual',

      role: 'Full Stack Developer',

      module:
        'Application Development',

      currentPhase:
        'Phase 1 - Research & Planning',

      progress: 45,

      status: 'On Track',

      lastUpdate:
        '08 Aug 2026'
    },


    {
      id: 6,

      name: 'Vignesh',

      registerNumber: 'CSE2026006',

      email: 'vignesh@example.com',

      department: 'Computer Science',

      projectName:
        'Smart Campus Management',

      projectType: 'Individual',

      role: 'Full Stack Developer',

      module:
        'Application Development',

      currentPhase:
        'Phase 2 - Development',

      progress: 60,

      status: 'On Track',

      lastUpdate:
        '07 Aug 2026'
    }

  ];


  get filteredStudents(): Student[] {

    const search =
      this.searchText
        .toLowerCase()
        .trim();


    return this.students.filter(student => {

      const matchesSearch =

        !search ||

        student.name
          .toLowerCase()
          .includes(search) ||

        student.registerNumber
          .toLowerCase()
          .includes(search) ||

        student.projectName
          .toLowerCase()
          .includes(search);


      const matchesProject =

        this.projectFilter === 'All' ||

        student.projectType ===
        this.projectFilter;


      const matchesStatus =

        this.statusFilter === 'All' ||

        student.status ===
        this.statusFilter;


      return (
        matchesSearch &&
        matchesProject &&
        matchesStatus
      );

    });

  }


  get totalStudents(): number {

    return this.students.length;

  }


  get teamStudents(): number {

    return this.students.filter(
      student =>
        student.projectType ===
        'Team Project'
    ).length;

  }


  get individualStudents(): number {

    return this.students.filter(
      student =>
        student.projectType ===
        'Individual'
    ).length;

  }


  get attentionStudents(): number {

    return this.students.filter(
      student =>
        student.status ===
        'Needs Attention'
    ).length;

  }


  clearFilters(): void {

    this.searchText = '';

    this.projectFilter = 'All';

    this.statusFilter = 'All';

  }


  getStatusClass(
    status: string
  ): string {

    if (status === 'Completed') {

      return 'completed';

    }


    if (status === 'Needs Attention') {

      return 'attention';

    }


    return 'track';

  }


  getProjectClass(
    type: string
  ): string {

    if (type === 'Individual') {

      return 'individual';

    }

    return 'team';

  }

}