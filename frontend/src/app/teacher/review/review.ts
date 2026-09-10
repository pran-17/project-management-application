import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TeacherSidebar } from '../../shared/teacher-sidebar/teacher-sidebar';
import { Header } from '../../shared/header/header';
import { ProjectTask, TaskService, TaskStatus } from '../../services/task.service';
import { TeacherPortalService } from '../../services/teacher-portal.service';

@Component({
  selector: 'app-review',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    TeacherSidebar,
    Header
  ],
  templateUrl: './review.html',
  styleUrl: './review.css'
})
export class Review implements OnInit {

  selectedSubmission: ProjectTask | null = null;

  teacherRemark = '';
  reviewProgress = 0;
  reviewStatus: TaskStatus = 'Under Review';
  reviewMessage = '';
  errorMessage = '';
  isSaving = false;

  filter = 'All';
  submissions: ProjectTask[] = [];
  guideName = '';

  constructor(
    private taskService: TaskService,
    private teacherPortal: TeacherPortalService
  ) {}

  ngOnInit(): void {
    this.teacherPortal.getMyProfile().subscribe({
      next: (teacher) => {
        this.guideName = teacher.name;
      }
    });
    this.loadTasks();
  }

  loadTasks(): void {
    this.taskService.getTeacherTasks().subscribe({
      next: (tasks) => {
        this.submissions = tasks;
        if (this.selectedSubmission) {
          this.selectedSubmission = tasks.find(task => task.id === this.selectedSubmission?.id) || this.selectedSubmission;
        }
      },
      error: (err) => {
        this.errorMessage = err?.error?.message || 'Failed to load assigned student tasks.';
      }
    });
  }

  get filteredSubmissions(): ProjectTask[] {
    if (this.filter === 'All') {
      return this.submissions;
    }
    return this.submissions.filter(submission => submission.status === this.filter);
  }

  openSubmission(submission: ProjectTask): void {
    this.selectedSubmission = submission;
    this.teacherRemark = submission.teacherRemark || '';
    this.reviewProgress = submission.progress;
    this.reviewStatus = submission.status;
    this.reviewMessage = '';
    this.errorMessage = '';
  }

  closeSubmission(): void {
    this.selectedSubmission = null;
    this.teacherRemark = '';
    this.reviewMessage = '';
  }

  saveReview(status?: TaskStatus): void {
    if (!this.selectedSubmission) return;

    if (!this.teacherRemark.trim()) {
      this.reviewMessage = 'Please enter a teacher remark before saving the review.';
      return;
    }

    this.isSaving = true;
    this.taskService.reviewTask(this.selectedSubmission.id, {
      teacherRemark: this.teacherRemark.trim(),
      status: status || this.reviewStatus,
      progress: this.reviewProgress
    }).subscribe({
      next: (updated) => {
        this.isSaving = false;
        this.selectedSubmission = updated;
        this.reviewMessage = 'Review saved successfully.';
        this.loadTasks();
      },
      error: (err) => {
        this.isSaving = false;
        this.errorMessage = err?.error?.message || 'Failed to save review.';
      }
    });
  }

  approveSubmission(): void {
    this.saveReview('Completed');
  }

  requestChanges(): void {
    this.saveReview('In Progress');
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
        return 'approved';
      case 'In Progress':
      case 'Pending':
        return 'changes';
      default:
        return 'review';
    }
  }

  getReviewCount(): number {
    return this.submissions.filter(submission => submission.status === 'Under Review').length;
  }

  getApprovedCount(): number {
    return this.submissions.filter(submission => submission.status === 'Completed').length;
  }

  getChangesCount(): number {
    return this.submissions.filter(submission => submission.status === 'In Progress').length;
  }

}
