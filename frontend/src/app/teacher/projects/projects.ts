import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

import { TeacherSidebar } from '../../shared/teacher-sidebar/teacher-sidebar';
import { Header } from '../../shared/header/header';

import { TeacherPortalService, MyProject as ApiProject } from '../../services/teacher-portal.service';

interface Project {
  id: string;
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
export class Projects implements OnInit {

  projects: Project[] = [];

  isLoading = false;

  constructor(private teacherPortalService: TeacherPortalService) {}

  ngOnInit(): void {
    this.loadMyProjects();
  }

  loadMyProjects(): void {

    this.isLoading = true;

    this.teacherPortalService.getMyProjects().subscribe({
      next: (projects) => {
        this.projects = projects.map(p => this.mapProject(p));
        this.isLoading = false;
      },
      error: (err) => {
        this.isLoading = false;
        console.error('Failed to load guided projects:', err);
      }
    });

  }

  // Detailed phase-tracking isn't modeled on the backend yet, so "phase" uses the
  // project's status as a stand-in until a Phase module is added.
  private mapProject(p: ApiProject): Project {
    return {
      id: p.id,
      name: p.title,
      type: p.students.length > 1 ? 'Team Project' : 'Individual',
      students: p.students.length,
      phase: p.status,
      progress: p.progress,
      status: p.status === 'Completed' ? 'Completed' : 'In Progress'
    };
  }

}
