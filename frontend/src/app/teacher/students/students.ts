import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

import { TeacherSidebar } from '../../shared/teacher-sidebar/teacher-sidebar';
import { Header } from '../../shared/header/header';

import { TeacherPortalService } from '../../services/teacher-portal.service';
import { Student as ApiStudent } from '../../services/student.service';

interface Student {
  id: string;
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
export class Students implements OnInit {


  searchText = '';

  projectFilter = 'All';

  statusFilter = 'All';

  isLoading = false;

  students: Student[] = [];

  constructor(private teacherPortalService: TeacherPortalService) {}

  ngOnInit(): void {
    this.loadMyStudents();
  }

  loadMyStudents(): void {

    this.isLoading = true;

    this.teacherPortalService.getMyStudents().subscribe({
      next: (students) => {
        this.students = students.map(s => this.mapStudent(s));
        this.isLoading = false;
      },
      error: (err) => {
        this.isLoading = false;
        console.error('Failed to load assigned students:', err);
      }
    });

  }

  // Maps the real Student record (from MongoDB) onto the richer display shape this
  // page's template expects. Project/task-tracking fields (module, phase, progress,
  // last update) aren't modeled on the backend yet, so they use sensible defaults
  // until a Task/Phase module is added.
  private mapStudent(s: ApiStudent): Student {
    return {
      id: s.id,
      name: s.name,
      registerNumber: s.registerNumber,
      email: s.email,
      department: s.department,
      projectName: s.project && s.project !== 'Not Assigned' ? s.project : 'Not Assigned',
      projectType: 'Individual',
      role: 'Team Member',
      module: '-',
      currentPhase: '-',
      progress: 0,
      status: s.status === 'Assigned' ? 'On Track' : 'Needs Attention',
      lastUpdate: '-'
    };
  }


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
