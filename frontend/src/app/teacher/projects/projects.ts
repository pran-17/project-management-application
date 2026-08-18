import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

import { TeacherSidebar } from '../../shared/teacher-sidebar/teacher-sidebar';
import { Header } from '../../shared/header/header';

interface Project {
  id: number;
  name: string;
  type: 'Team Project' | 'Individual';
  students: number;
  phase: string;
  progress: number;
  status: 'In Progress' | 'Completed';
}

@Component({
  selector: 'app-projects',
  standalone: true,

  imports: [
    CommonModule,
    RouterModule,
    TeacherSidebar,
    Header
  ],

  templateUrl: './projects.html',
  styleUrl: './projects.css'
})
export class Projects {

  projects: Project[] = [
    {
      id: 1,
      name: 'AI-Based Attendance Management System',
      type: 'Team Project',
      students: 4,
      phase: 'Phase 2 - Development',
      progress: 75,
      status: 'In Progress'
    },

    {
      id: 2,
      name: 'Library Management System',
      type: 'Individual',
      students: 1,
      phase: 'Phase 3 - Testing',
      progress: 100,
      status: 'Completed'
    },

    {
      id: 3,
      name: 'Smart Parking System',
      type: 'Individual',
      students: 1,
      phase: 'Phase 1 - Research',
      progress: 45,
      status: 'In Progress'
    }
  ];

}