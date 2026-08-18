import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

import { TeacherSidebar } from '../../shared/teacher-sidebar/teacher-sidebar';
import { Header } from '../../shared/header/header';

@Component({
  selector: 'app-funding',
  standalone: true,

  imports: [
    CommonModule,
    TeacherSidebar,
    Header
  ],

  templateUrl: './funding.html',
  styleUrl: './funding.css'
})
export class Funding {

  totalFunding = 450000;

  totalReceived = 450000;

  totalSpent = 272000;

  get remaining(): number {
    return this.totalReceived - this.totalSpent;
  }

  transactions = [

    {
      date: '05 Aug 2026',
      research: 'AI-Based Student Attendance Prediction',
      description: 'Cloud services',
      amount: 25000
    },

    {
      date: '01 Aug 2026',
      research: 'IoT-Based Smart Campus',
      description: 'IoT sensors',
      amount: 45000
    },

    {
      date: '20 Jul 2026',
      research: 'Machine Learning for Academic Performance',
      description: 'Computing resources',
      amount: 35000
    }

  ];

}