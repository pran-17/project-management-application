import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

import { TeacherSidebar } from '../../shared/teacher-sidebar/teacher-sidebar';
import { Header } from '../../shared/header/header';

import { ResearchService } from '../../services/research.service';

interface ResearchListItem {
  id: string;
  title: string;
  area: string;
  students: number;
  status: string;
  funding: number;
  spent: number;
  progress: number;
}

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
export class Research implements OnInit {

  isLoading = false;

  researchProjects: ResearchListItem[] = [];

  constructor(private researchService: ResearchService) {}

  ngOnInit(): void {

    this.isLoading = true;

    // Backend already filters this to research projects where this teacher is
    // Principal Investigator or listed as a research teacher.
    this.researchService.getProjects().subscribe({
      next: (projects) => {
        this.isLoading = false;

        this.researchProjects = projects.map(p => ({
          id: p.id,
          title: p.title,
          area: p.researchArea || p.department,
          students: p.students.length,
          status: p.status,
          funding: p.budget,
          // Fund utilization isn't tracked per research project on the backend yet
          // (only a total budget exists) - stays 0 until that's added.
          spent: 0,
          progress: p.progress
        }));
      },
      error: (err) => {
        this.isLoading = false;
        console.error('Failed to load research projects:', err);
      }
    });

  }

}
