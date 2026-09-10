import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Sidebar } from '../../shared/sidebar/sidebar';
import { Header } from '../../shared/header/header';
import { PhaseService, ProjectPhase } from '../../services/phase.service';
import { ProjectTask, TaskPriority, TaskService, TaskStatus } from '../../services/task.service';

@Component({
  selector: 'app-tasks',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    Sidebar,
    Header
  ],
  templateUrl: './tasks.html',
  styleUrl: './tasks.css'
})
export class Tasks implements OnInit {

  selectedFilter = 'All';
  selectedSort = 'updated';

  selectedTask: ProjectTask | null = null;
  showUpdateForm = false;
  showAddForm = false;

  updateProgress = 0;
  updateStatus: TaskStatus = 'In Progress';
  workDescription = '';
  studentRemark = '';
  submissionMessage = '';
  errorMessage = '';
  isSaving = false;
  isLoading = false;

  phases: ProjectPhase[] = [];
  tasks: ProjectTask[] = [];

  currentPhaseLabel = 'No active phase';

  newTask = {
    title: '',
    description: '',
    phase: '',
    priority: 'Medium' as TaskPriority,
    assignedDate: '',
    dueDate: '',
    studentWork: '',
    progress: 0,
    status: 'Pending' as TaskStatus,
    studentRemark: ''
  };

  constructor(
    private taskService: TaskService,
    private phaseService: PhaseService
  ) {}

  ngOnInit(): void {
    this.loadPhases();
    this.loadTasks();
  }

  loadPhases(): void {
    this.phaseService.getPhases().subscribe({
      next: (phases) => {
        this.phases = phases.filter(phase => phase.status !== 'Inactive');
        const active = this.phases.find(phase => phase.status === 'Active')
          || this.phases.find(phase => phase.status === 'Upcoming')
          || this.phases[0];
        this.currentPhaseLabel = active
          ? `Phase ${active.phaseNumber} - ${active.phaseName}`
          : 'No department phase';
      },
      error: (err) => {
        this.errorMessage = err?.error?.message || 'Failed to load project phases.';
      }
    });
  }

  loadTasks(): void {
    this.isLoading = true;
    this.taskService.getMyTasks().subscribe({
      next: (tasks) => {
        this.tasks = tasks;
        this.isLoading = false;
        if (this.selectedTask) {
          this.selectedTask = tasks.find(task => task.id === this.selectedTask?.id) || this.selectedTask;
        }
      },
      error: (err) => {
        this.isLoading = false;
        this.errorMessage = err?.error?.message || 'Failed to load tasks.';
      }
    });
  }

  get filteredTasks(): ProjectTask[] {
    let list = this.selectedFilter === 'All'
      ? [...this.tasks]
      : this.tasks.filter(task => task.status === this.selectedFilter);

    switch (this.selectedSort) {
      case 'due':
        list.sort((a, b) => this.toTime(a.dueDate) - this.toTime(b.dueDate));
        break;
      case 'priority':
        list.sort((a, b) => this.priorityRank(b.priority) - this.priorityRank(a.priority));
        break;
      case 'progress':
        list.sort((a, b) => b.progress - a.progress);
        break;
      default:
        list.sort((a, b) => this.toTime(b.updatedAt) - this.toTime(a.updatedAt));
    }

    return list;
  }

  openAddForm(): void {
    const today = new Date().toISOString().slice(0, 10);
    const active = this.phases.find(phase => phase.status === 'Active') || this.phases[0];
    this.newTask = {
      title: '',
      description: '',
      phase: active?.id || '',
      priority: 'Medium',
      assignedDate: today,
      dueDate: '',
      studentWork: '',
      progress: 0,
      status: 'Pending',
      studentRemark: ''
    };
    this.errorMessage = '';
    this.submissionMessage = '';
    this.showAddForm = true;
  }

  closeAddForm(): void {
    this.showAddForm = false;
  }

  createTask(): void {
    if (!this.newTask.title.trim() || !this.newTask.phase) {
      this.errorMessage = 'Please enter a task title and select a project phase.';
      return;
    }

    this.isSaving = true;
    this.errorMessage = '';

    this.taskService.createTask({
      title: this.newTask.title.trim(),
      description: this.newTask.description.trim(),
      phase: this.newTask.phase,
      priority: this.newTask.priority,
      assignedDate: this.newTask.assignedDate || undefined,
      dueDate: this.newTask.dueDate || undefined,
      studentWork: this.newTask.studentWork.trim(),
      progress: this.newTask.progress,
      status: this.newTask.status,
      studentRemark: this.newTask.studentRemark.trim()
    }).subscribe({
      next: () => {
        this.isSaving = false;
        this.showAddForm = false;
        this.loadTasks();
      },
      error: (err) => {
        this.isSaving = false;
        this.errorMessage = err?.error?.message || 'Failed to create task.';
      }
    });
  }

  selectTask(task: ProjectTask): void {
    this.selectedTask = task;
    this.updateProgress = task.progress;
    this.updateStatus = task.status;
    this.workDescription = task.studentWork || '';
    this.studentRemark = task.studentRemark || '';
    this.submissionMessage = '';
    this.errorMessage = '';
    this.showUpdateForm = false;
  }

  closeTask(): void {
    this.selectedTask = null;
    this.showUpdateForm = false;
  }

  openUpdateForm(): void {
    if (!this.selectedTask) return;
    this.updateProgress = this.selectedTask.progress;
    this.updateStatus = this.selectedTask.status;
    this.workDescription = this.selectedTask.studentWork || '';
    this.studentRemark = this.selectedTask.studentRemark || '';
    this.showUpdateForm = true;
  }

  cancelUpdate(): void {
    this.showUpdateForm = false;
  }

  submitWorkUpdate(): void {
    if (!this.selectedTask) return;

    this.isSaving = true;
    this.errorMessage = '';

    const nextStatus: TaskStatus = this.updateStatus === 'Pending' && this.updateProgress > 0
      ? 'In Progress'
      : this.updateStatus;

    this.taskService.updateTask(this.selectedTask.id, {
      progress: this.updateProgress,
      status: nextStatus,
      studentWork: this.workDescription,
      studentRemark: this.studentRemark
    }).subscribe({
      next: (updated) => {
        this.isSaving = false;
        this.selectedTask = updated;
        this.submissionMessage = 'Work update saved successfully.';
        this.showUpdateForm = false;
        this.loadTasks();
      },
      error: (err) => {
        this.isSaving = false;
        this.errorMessage = err?.error?.message || 'Failed to update task.';
      }
    });
  }

  submitForReview(): void {
    if (!this.selectedTask) return;

    if (!this.workDescription.trim()) {
      this.submissionMessage = 'Please enter a description of the work completed.';
      return;
    }

    this.isSaving = true;
    this.taskService.updateTask(this.selectedTask.id, {
      progress: this.updateProgress,
      status: 'Under Review',
      studentWork: this.workDescription,
      studentRemark: this.studentRemark
    }).subscribe({
      next: (updated) => {
        this.isSaving = false;
        this.selectedTask = updated;
        this.submissionMessage = 'Work update submitted successfully for teacher review.';
        this.showUpdateForm = false;
        this.loadTasks();
      },
      error: (err) => {
        this.isSaving = false;
        this.errorMessage = err?.error?.message || 'Failed to submit work for review.';
      }
    });
  }

  formatDate(value: string): string {
    if (!value) return '-';
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return value;
    return date.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
  }

  getStatusClass(status: string): string {
    switch (status) {
      case 'Completed':
        return 'completed';
      case 'Under Review':
        return 'review';
      case 'In Progress':
        return 'progress';
      default:
        return 'pending';
    }
  }

  getPriorityClass(priority: string): string {
    switch (priority) {
      case 'High':
        return 'high';
      case 'Medium':
        return 'medium';
      default:
        return 'low';
    }
  }

  getCompletedCount(): number {
    return this.tasks.filter(task => task.status === 'Completed').length;
  }

  getProgressCount(): number {
    return this.tasks.filter(task => task.status === 'In Progress').length;
  }

  getReviewCount(): number {
    return this.tasks.filter(task => task.status === 'Under Review').length;
  }

  getPendingCount(): number {
    return this.tasks.filter(task => task.status === 'Pending').length;
  }

  private toTime(value: string): number {
    const time = new Date(value).getTime();
    return Number.isNaN(time) ? 0 : time;
  }

  private priorityRank(priority: TaskPriority): number {
    if (priority === 'High') return 3;
    if (priority === 'Medium') return 2;
    return 1;
  }

}
