import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { AdminSidebar } from '../../shared/admin-sidebar/admin-sidebar';
import { Header } from '../../shared/header/header';
import { PhasePayload, PhaseService, ProjectPhase } from '../../services/phase.service';

@Component({
  selector: 'app-admin-phases',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    AdminSidebar,
    Header
  ],
  templateUrl: './phases.html',
  styleUrl: './phases.css'
})
export class Phases implements OnInit {

  phases: ProjectPhase[] = [];
  selectedPhase: ProjectPhase | null = null;
  showForm = false;
  editingId = '';
  errorMessage = '';
  isSaving = false;
  isLoading = false;

  departments = [
    'Computer Science',
    'Information Technology',
    'Artificial Intelligence',
    'Electronics',
    'ECE',
    'Mechanical'
  ];

  form: PhasePayload = this.emptyForm();

  constructor(private phaseService: PhaseService) {}

  ngOnInit(): void {
    this.loadPhases();
  }

  loadPhases(): void {
    this.isLoading = true;
    this.phaseService.getPhases().subscribe({
      next: (phases) => {
        this.phases = phases;
        this.isLoading = false;
      },
      error: (err) => {
        this.isLoading = false;
        this.errorMessage = err?.error?.message || 'Failed to load project phases.';
      }
    });
  }

  get totalPhases(): number {
    return this.phases.length;
  }

  get completedCount(): number {
    return this.phases.filter(phase => phase.status === 'Completed').length;
  }

  get activeCount(): number {
    return this.phases.filter(phase => phase.status === 'Active').length;
  }

  get upcomingCount(): number {
    return this.phases.filter(phase => phase.status === 'Upcoming').length;
  }

  openAddForm(): void {
    this.editingId = '';
    this.form = this.emptyForm();
    this.errorMessage = '';
    this.showForm = true;
  }

  openEditForm(phase: ProjectPhase): void {
    this.editingId = phase.id;
    this.form = {
      phaseNumber: phase.phaseNumber,
      phaseName: phase.phaseName,
      description: phase.description,
      department: phase.department,
      startDate: this.toDateInput(phase.startDate),
      endDate: this.toDateInput(phase.endDate),
      status: phase.status
    };
    this.errorMessage = '';
    this.showForm = true;
  }

  closeForm(): void {
    this.showForm = false;
    this.editingId = '';
  }

  savePhase(): void {
    if (
      !this.form.phaseNumber ||
      !this.form.phaseName.trim() ||
      !this.form.department ||
      !this.form.startDate ||
      !this.form.endDate
    ) {
      this.errorMessage = 'Please fill phase number, name, department, start date and end date.';
      return;
    }

    if (Number(this.form.phaseNumber) < 1) {
      this.errorMessage = 'Phase number must be 1 or greater.';
      return;
    }

    if (new Date(this.form.endDate) < new Date(this.form.startDate)) {
      this.errorMessage = 'End date cannot be before start date.';
      return;
    }

    // Client-side duplicate check for immediate feedback - the backend enforces
    // this too (unique phaseNumber + department), so this is a fast-fail only.
    const duplicate = this.phases.find(p =>
      p.id !== this.editingId &&
      p.phaseNumber === Number(this.form.phaseNumber) &&
      p.department === this.form.department
    );
    if (duplicate) {
      this.errorMessage = `Phase ${this.form.phaseNumber} already exists for ${this.form.department}.`;
      return;
    }

    this.isSaving = true;
    this.errorMessage = '';

    const payload: PhasePayload = {
      phaseNumber: Number(this.form.phaseNumber),
      phaseName: this.form.phaseName.trim(),
      description: this.form.description?.trim() || '',
      department: this.form.department,
      startDate: this.form.startDate,
      endDate: this.form.endDate,
      status: this.form.status
    };

    const request = this.editingId
      ? this.phaseService.updatePhase(this.editingId, payload)
      : this.phaseService.createPhase(payload);

    request.subscribe({
      next: () => {
        this.isSaving = false;
        this.showForm = false;
        this.loadPhases();
      },
      error: (err) => {
        this.isSaving = false;
        this.errorMessage = err?.error?.message || 'Failed to save phase.';
      }
    });
  }

  deletePhase(phase: ProjectPhase): void {
    const confirmed = confirm(
      `Delete Phase ${phase.phaseNumber} - ${phase.phaseName} for ${phase.department}?`
    );
    if (!confirmed) return;

    this.phaseService.deletePhase(phase.id).subscribe({
      next: () => {
        if (this.selectedPhase?.id === phase.id) {
          this.selectedPhase = null;
        }
        this.loadPhases();
      },
      error: (err) => {
        this.errorMessage = err?.error?.message || 'Failed to delete phase.';
      }
    });
  }

  toggleActive(phase: ProjectPhase): void {
    const nextStatus = phase.status === 'Active' ? 'Inactive' : 'Active';
    this.phaseService.updatePhase(phase.id, { status: nextStatus }).subscribe({
      next: () => this.loadPhases(),
      error: (err) => {
        this.errorMessage = err?.error?.message || 'Failed to update phase status.';
      }
    });
  }

  selectPhase(phase: ProjectPhase): void {
    this.selectedPhase = phase;
  }

  closeDetails(): void {
    this.selectedPhase = null;
  }

  formatDate(value: string): string {
    if (!value) return '-';
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return value;
    return date.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
  }

  statusClass(status: string): string {
    if (status === 'Completed') return 'completed';
    if (status === 'Active') return 'in-progress';
    if (status === 'Inactive') return 'inactive';
    return 'upcoming';
  }

  private emptyForm(): PhasePayload {
    return {
      phaseNumber: 1,
      phaseName: '',
      description: '',
      department: '',
      startDate: '',
      endDate: '',
      status: 'Upcoming'
    };
  }

  private toDateInput(value: string): string {
    if (!value) return '';
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return '';
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${date.getFullYear()}-${month}-${day}`;
  }
}
