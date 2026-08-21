import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AdminSidebar } from '../../shared/admin-sidebar/admin-sidebar';
import { Header } from '../../shared/header/header';

@Component({
  selector: 'app-admin-phases',
  standalone: true,
  imports: [
    CommonModule,
    AdminSidebar,
    Header
  ],
  templateUrl: './phases.html',
  styleUrl: './phases.css'
})
export class Phases {

  phases = [
    {
      id: 1,
      name: 'Phase 1',
      title: 'Research & Planning',
      description: 'Problem identification, research and project planning.',
      projects: 12,
      students: 48,
      startDate: '10 Jun 2026',
      endDate: '30 Jun 2026',
      progress: 100,
      status: 'Completed'
    },
    {
      id: 2,
      name: 'Phase 2',
      title: 'Design & Development',
      description: 'System design, development and implementation.',
      projects: 12,
      students: 48,
      startDate: '01 Jul 2026',
      endDate: '31 Aug 2026',
      progress: 68,
      status: 'In Progress'
    },
    {
      id: 3,
      name: 'Phase 3',
      title: 'Testing & Review',
      description: 'Testing the application and fixing identified issues.',
      projects: 12,
      students: 48,
      startDate: '01 Sep 2026',
      endDate: '30 Sep 2026',
      progress: 0,
      status: 'Upcoming'
    },
    {
      id: 4,
      name: 'Phase 4',
      title: 'Final Submission',
      description: 'Final documentation, presentation and submission.',
      projects: 12,
      students: 48,
      startDate: '01 Oct 2026',
      endDate: '30 Nov 2026',
      progress: 0,
      status: 'Upcoming'
    }
  ];

  selectedPhase: any = null;

  selectPhase(phase: any) {
    this.selectedPhase = phase;
  }

  closeDetails() {
    this.selectedPhase = null;
  }
}