import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';

import { Sidebar } from '../../shared/sidebar/sidebar';
import { Header } from '../../shared/header/header';
import { PhaseService, ProjectPhase } from '../../services/phase.service';
import { ProjectTask, TaskService } from '../../services/task.service';

@Component({
  selector: 'app-student-phases',
  standalone: true,
  imports: [
    CommonModule,
    Sidebar,
    Header
  ],
  templateUrl: './phases.html',
  styleUrl: './phases.css'
})
export class Phases implements OnInit {

  phases: ProjectPhase[] = [];
  selectedPhase: ProjectPhase | null = null;
  phaseTasks: ProjectTask[] = [];
  errorMessage = '';
  isLoading = false;

  constructor(
    private phaseService: PhaseService,
    private taskService: TaskService
  ) {}

  ngOnInit(): void {
    this.loadPhases();
  }

  loadPhases(): void {
    this.isLoading = true;
    this.phaseService.getPhases().subscribe({
      next: (phases) => {
        this.phases = phases.filter(phase => phase.status !== 'Inactive');
        this.isLoading = false;
      },
      error: (err) => {
        this.isLoading = false;
        this.errorMessage = err?.error?.message || 'Failed to load project phases.';
      }
    });
  }

  get currentPhase(): ProjectPhase | null {
    return this.phases.find(phase => phase.status === 'Active')
      || this.phases.find(phase => phase.status === 'Upcoming')
      || this.phases[0]
      || null;
  }

  get overallProgress(): number {
    if (!this.phases.length) return 0;
    const total = this.phases.reduce((sum, phase) => sum + (phase.progress || 0), 0);
    return Math.round(total / this.phases.length);
  }

  openPhase(phase: ProjectPhase): void {
    this.selectedPhase = phase;
    this.taskService.getMyTasks({ phase: phase.id }).subscribe({
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

}
