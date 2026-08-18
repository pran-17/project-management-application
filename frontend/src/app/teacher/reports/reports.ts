import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

import { TeacherSidebar } from '../../shared/teacher-sidebar/teacher-sidebar';
import { Header } from '../../shared/header/header';

@Component({
  selector: 'app-reports',
  standalone: true,

  imports: [
    CommonModule,
    TeacherSidebar,
    Header
  ],

  templateUrl: './reports.html',
  styleUrl: './reports.css'
})
export class Reports {

  students = 24;

  activeProjects = 8;

  completedProjects = 3;

  underReview = 2;

  phaseData = [

    {
      phase: 'Research & Planning',
      completed: 18,
      total: 24,
      percentage: 75
    },

    {
      phase: 'Development',
      completed: 14,
      total: 24,
      percentage: 58
    },

    {
      phase: 'Testing',
      completed: 4,
      total: 24,
      percentage: 17
    },

    {
      phase: 'Final Submission',
      completed: 2,
      total: 24,
      percentage: 8
    }

  ];

}