import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

import { TeacherSidebar } from '../../shared/teacher-sidebar/teacher-sidebar';
import { Header } from '../../shared/header/header';
import { PhaseService, ProjectPhase } from '../../services/phase.service';
import { ProjectTask, TaskService } from '../../services/task.service';
import { TeacherPortalService } from '../../services/teacher-portal.service';

@Component({
  selector: 'app-phases',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    RouterModule,
    TeacherSidebar,
    Header
  ],
  templateUrl: './phases.html',
  styleUrl: './phases.css'
})
export class Phases implements OnInit {

  selectedPhase: ProjectPhase | null = null;
  phases: ProjectPhase[] = [];
  submissions: ProjectTask[] = [];
  phaseTasks: ProjectTask[] = [];
  department = '';
  errorMessage = '';

  constructor(
    private phaseService: PhaseService,
    private taskService: TaskService,
    private teacherPortal: TeacherPortalService
  ) {}

  ngOnInit(): void {
    this.teacherPortal.getMyProfile().subscribe({
      next: (teacher) => {
        this.department = teacher.department;
      }
    });
    this.loadPhases();
    this.loadTasks();
  }

  loadPhases(): void {
    this.phaseService.getPhases().subscribe({
      next: (phases) => {
        this.phases = phases.filter(phase => phase.status !== 'Inactive');
      },
      error: (err) => {
        this.errorMessage = err?.error?.message || 'Failed to load department phases.';
      }
    });
  }

  loadTasks(): void {
    this.taskService.getTeacherTasks().subscribe({
      next: (tasks) => {
        this.submissions = tasks.slice(0, 8);
      },
      error: (err) => {
        this.errorMessage = err?.error?.message || 'Failed to load student work.';
      }
    });
  }

  get completedPhases(): number {
    return this.phases.filter(phase => phase.status === 'Completed').length;
  }

  get activePhases(): number {
    return this.phases.filter(phase => phase.status === 'Active').length;
  }

  get pendingPhases(): number {
    return this.phases.filter(phase => phase.status === 'Upcoming' || phase.status === 'Inactive').length;
  }

  openPhase(phase: ProjectPhase): void {
    this.selectedPhase = phase;
    this.taskService.getTeacherTasks({ phase: phase.id }).subscribe({
      next: (tasks) => {
        this.phaseTasks = tasks;
      },
      error: () => {
        this.phaseTasks = [];
      }
    });
  }

  closePhase(): void {
    this.selectedPhase = null;
    this.phaseTasks = [];
  }

  formatDate(value: string): string {
    if (!value) return '-';
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return value;
    return date.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
  }

  getPhaseClass(status: string): string {
    if (status === 'Completed') return 'completed';
    if (status === 'Active' || status === 'In Progress') return 'active';
    return 'pending';
  }

  getSubmissionClass(status: string): string {
    if (status === 'Completed') return 'approved';
    if (status === 'In Progress' || status === 'Pending') return 'changes';
    return 'review';
  }

}
