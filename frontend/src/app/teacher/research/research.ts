import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

import { TeacherSidebar } from '../../shared/teacher-sidebar/teacher-sidebar';
import { Header } from '../../shared/header/header';

@Component({
  selector: 'app-research',
  standalone: true,

  imports: [
    CommonModule,
    RouterModule,
    TeacherSidebar,
    Header
  ],

  templateUrl: './research.html',
  styleUrl: './research.css'
})
export class Research {

  researchProjects = [

    {
      id: 1,
      title: 'AI-Based Student Attendance Prediction',
      area: 'Artificial Intelligence',
      students: 4,
      status: 'Active',
      funding: 150000,
      spent: 85000,
      progress: 60
    },

    {
      id: 2,
      title: 'IoT-Based Smart Campus',
      area: 'Internet of Things',
      students: 3,
      status: 'Active',
      funding: 200000,
      spent: 95000,
      progress: 45
    },

    {
      id: 3,
      title: 'Machine Learning for Academic Performance',
      area: 'Machine Learning',
      students: 2,
      status: 'Completed',
      funding: 100000,
      spent: 92000,
      progress: 100
    }

  ];

}