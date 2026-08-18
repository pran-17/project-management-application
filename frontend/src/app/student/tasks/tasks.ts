import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Sidebar } from '../../shared/sidebar/sidebar';
import { Header } from '../../shared/header/header';

interface Task {
  id: number;
  title: string;
  module: string;
  phase: string;
  description: string;
  assignedDate: string;
  dueDate: string;
  progress: number;
  status: 'Completed' | 'In Progress' | 'Pending' | 'Under Review';
  priority: 'High' | 'Medium' | 'Low';
  teacherRemark: string;
}

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
export class Tasks {

  selectedFilter = 'All';

  selectedTask: Task | null = null;

  showUpdateForm = false;

  updateProgress = 0;

  workDescription = '';

  studentRemark = '';

  submissionMessage = '';


  tasks: Task[] = [

    {
      id: 1,
      title: 'Design Student Dashboard',
      module: 'Frontend Development',
      phase: 'Phase 2',
      description:
        'Create the student dashboard interface including sidebar, header, project progress and recent activities.',
      assignedDate: '01 Aug 2026',
      dueDate: '12 Aug 2026',
      progress: 100,
      status: 'Completed',
      priority: 'High',
      teacherRemark:
        'Dashboard design completed successfully. Good work.'
    },

    {
      id: 2,
      title: 'Implement Authentication',
      module: 'Frontend Development',
      phase: 'Phase 2',
      description:
        'Implement login page and role-based navigation for student and teacher users.',
      assignedDate: '05 Aug 2026',
      dueDate: '18 Aug 2026',
      progress: 80,
      status: 'Under Review',
      priority: 'High',
      teacherRemark:
        'Authentication interface submitted. Waiting for final review.'
    },

    {
      id: 3,
      title: 'Create MongoDB Database',
      module: 'Database',
      phase: 'Phase 2',
      description:
        'Design database collections for users, projects, teams, tasks and teacher remarks.',
      assignedDate: '08 Aug 2026',
      dueDate: '20 Aug 2026',
      progress: 60,
      status: 'In Progress',
      priority: 'High',
      teacherRemark:
        ''
    },

    {
      id: 4,
      title: 'Project API Development',
      module: 'Backend Development',
      phase: 'Phase 2',
      description:
        'Develop REST APIs for project management and student project information.',
      assignedDate: '12 Aug 2026',
      dueDate: '25 Aug 2026',
      progress: 30,
      status: 'In Progress',
      priority: 'Medium',
      teacherRemark:
        ''
    },

    {
      id: 5,
      title: 'Project Documentation',
      module: 'Documentation',
      phase: 'Phase 2',
      description:
        'Prepare system documentation including architecture, modules and project workflow.',
      assignedDate: '15 Aug 2026',
      dueDate: '30 Aug 2026',
      progress: 0,
      status: 'Pending',
      priority: 'Low',
      teacherRemark:
        ''
    }

  ];


  get filteredTasks(): Task[] {

    if (this.selectedFilter === 'All') {
      return this.tasks;
    }

    return this.tasks.filter(
      task => task.status === this.selectedFilter
    );

  }


  selectTask(task: Task): void {

    this.selectedTask = task;

    this.updateProgress = task.progress;

    this.workDescription = '';

    this.studentRemark = '';

    this.submissionMessage = '';

    this.showUpdateForm = false;

  }


  closeTask(): void {

    this.selectedTask = null;

    this.showUpdateForm = false;

  }


  openUpdateForm(): void {

    if (!this.selectedTask) {
      return;
    }

    this.updateProgress = this.selectedTask.progress;

    this.showUpdateForm = true;

  }


  cancelUpdate(): void {

    this.showUpdateForm = false;

  }


  submitWorkUpdate(): void {

    if (!this.selectedTask) {
      return;
    }

    if (!this.workDescription.trim()) {

      this.submissionMessage =
        'Please enter a description of the work completed.';

      return;

    }


    this.selectedTask.progress = this.updateProgress;

    this.selectedTask.status =
      this.updateProgress >= 100
        ? 'Under Review'
        : 'In Progress';


    this.submissionMessage =
      'Work update submitted successfully for teacher review.';


    this.showUpdateForm = false;

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

    return this.tasks.filter(
      task => task.status === 'Completed'
    ).length;

  }


  getProgressCount(): number {

    return this.tasks.filter(
      task => task.status === 'In Progress'
    ).length;

  }


  getReviewCount(): number {

    return this.tasks.filter(
      task => task.status === 'Under Review'
    ).length;

  }


  getPendingCount(): number {

    return this.tasks.filter(
      task => task.status === 'Pending'
    ).length;

  }

}