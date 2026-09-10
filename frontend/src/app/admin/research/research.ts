import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';


import { AdminSidebar } from '../../shared/admin-sidebar/admin-sidebar';

import {
  ResearchService,
  ResearchProject
} from '../../services/research.service';

import { TeacherService, Teacher } from '../../services/teacher.service';
import { StudentService, Student } from '../../services/student.service';

@Component({
  selector: 'app-research-projects',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    AdminSidebar
  ],
  templateUrl: './research.html',
  styleUrl: './research.css'
})
export class ResearchProjects implements OnInit {

  searchText = '';

  selectedDepartment = 'All';

  // Controls the details popup
  showDetails = false;

  // Selected project for View Details
  selectedProject: ResearchProject | null = null;

  projects: ResearchProject[] = [];

  // Full lists loaded once, used for the Principal Investigator / teacher / student pickers
  allTeachers: Teacher[] = [];
  allStudents: Student[] = [];

  // ADD RESEARCH PROJECT FORM STATE
  showAddForm = false;
  isSaving = false;
  formError = '';

  newResearch = {
    researchId: '',
    title: '',
    description: '',
    researchArea: '',
    department: '',
    principalInvestigatorId: '',
    fundingAgency: '',
    budget: 0,
    startDate: '',
    endDate: '',
    status: 'Pending'
  };

  teacherSearchText = '';
  selectedTeachers: Teacher[] = [];

  studentSearchText = '';
  selectedStudents: Student[] = [];

  constructor(
    private researchService: ResearchService,
    private teacherService: TeacherService,
    private studentService: StudentService
  ) {}

  ngOnInit(): void {
    this.loadProjects();
  }

  loadProjects(): void {
    this.researchService.getProjects().subscribe({
      next: (projects) => {
        this.projects = projects;
      },
      error: (err) => console.error('Failed to load research projects:', err)
    });
  }

  get filteredProjects(): ResearchProject[] {

    const search = this.searchText.toLowerCase();

    return this.projects.filter(project => {

      const matchesSearch =
        project.title.toLowerCase().includes(search) ||
        project.researchId.toLowerCase().includes(search) ||
        (project.principalInvestigator?.name || '').toLowerCase().includes(search);

      const matchesDepartment =
        this.selectedDepartment === 'All' ||
        project.department === this.selectedDepartment;

      return matchesSearch && matchesDepartment;

    });

  }

  get ongoingProjectsCount(): number {

    return this.projects.filter(
      project => project.status === 'Ongoing'
    ).length;

  }

  get completedProjectsCount(): number {

    return this.projects.filter(
      project => project.status === 'Completed'
    ).length;

  }

  get pendingProjectsCount(): number {

    return this.projects.filter(
      project => project.status === 'Pending'
    ).length;

  }

  get totalFunding(): number {

    return this.projects.reduce(
      (total, project) => total + project.budget,
      0
    );

  }


  // VIEW DETAILS
  viewProject(project: ResearchProject): void {

    // Fetch the latest details (including populated team members) from the API
    this.researchService.getProjectById(project.id).subscribe({
      next: (fullProject) => {
        this.selectedProject = fullProject;
        this.showDetails = true;
      },
      error: (err) => {
        console.error('Failed to load research project details:', err);
        // Fall back to the already-loaded summary if the detail fetch fails
        this.selectedProject = project;
        this.showDetails = true;
      }
    });

  }


  // CLOSE DETAILS
  closeDetails(): void {

    this.showDetails = false;

    this.selectedProject = null;

  }


  deleteProject(id: string): void {

    this.researchService.deleteProject(id).subscribe({
      next: () => {
        this.projects = this.projects.filter(
          project => project.id !== id
        );

        // Close popup if the currently selected project is deleted
        if (this.selectedProject?.id === id) {
          this.closeDetails();
        }
      },
      error: (err) => {
        console.error('Failed to delete research project:', err);
        alert('Failed to delete research project. Please try again.');
      }
    });

  }


  // ============ ADD RESEARCH PROJECT FORM ============

  openAddForm(): void {
    this.showAddForm = true;
    this.formError = '';

    // Load teacher/student lists the first time the form is opened
    if (this.allTeachers.length === 0) {
      this.teacherService.getTeachers().subscribe({
        next: (teachers) => this.allTeachers = teachers,
        error: (err) => console.error('Failed to load teachers:', err)
      });
    }
    if (this.allStudents.length === 0) {
      this.studentService.getStudents().subscribe({
        next: (students) => this.allStudents = students,
        error: (err) => console.error('Failed to load students:', err)
      });
    }
  }

  closeAddForm(): void {
    this.showAddForm = false;
    this.resetForm();
  }

  private resetForm(): void {
    this.newResearch = {
      researchId: '',
      title: '',
      description: '',
      researchArea: '',
      department: '',
      principalInvestigatorId: '',
      fundingAgency: '',
      budget: 0,
      startDate: '',
      endDate: '',
      status: 'Pending'
    };
    this.selectedTeachers = [];
    this.selectedStudents = [];
    this.teacherSearchText = '';
    this.studentSearchText = '';
    this.formError = '';
  }

  get filteredTeacherResults(): Teacher[] {
    const search = this.teacherSearchText.trim().toLowerCase();
    if (!search) return [];
    return this.allTeachers.filter(t =>
      (t.name.toLowerCase().includes(search) || t.employeeId.toLowerCase().includes(search)) &&
      !this.selectedTeachers.some(sel => sel.id === t.id) &&
      t.id !== this.newResearch.principalInvestigatorId
    ).slice(0, 6);
  }

  get filteredStudentResults(): Student[] {
    const search = this.studentSearchText.trim().toLowerCase();
    if (!search) return [];
    return this.allStudents.filter(s =>
      (s.name.toLowerCase().includes(search) || s.registerNumber.toLowerCase().includes(search)) &&
      !this.selectedStudents.some(sel => sel.id === s.id)
    ).slice(0, 6);
  }

  addTeacherToTeam(teacher: Teacher): void {
    this.selectedTeachers.push(teacher);
    this.teacherSearchText = '';
  }

  removeTeacherFromTeam(id: string): void {
    this.selectedTeachers = this.selectedTeachers.filter(t => t.id !== id);
  }

  addStudentToTeam(student: Student): void {
    this.selectedStudents.push(student);
    this.studentSearchText = '';
  }

  removeStudentFromTeam(id: string): void {
    this.selectedStudents = this.selectedStudents.filter(s => s.id !== id);
  }

  get selectedPI(): Teacher | undefined {
    return this.allTeachers.find(t => t.id === this.newResearch.principalInvestigatorId);
  }

  submitResearchProject(): void {

    this.formError = '';

    if (!this.newResearch.researchId.trim() || !this.newResearch.title.trim() ||
        !this.newResearch.department.trim() || !this.newResearch.principalInvestigatorId) {
      this.formError = 'Please fill in Research ID, Title, Department and Principal Investigator.';
      return;
    }

    this.isSaving = true;

    this.researchService.addProject({
      researchId: this.newResearch.researchId.trim(),
      title: this.newResearch.title.trim(),
      description: this.newResearch.description.trim(),
      researchArea: this.newResearch.researchArea.trim(),
      department: this.newResearch.department.trim(),
      principalInvestigator: this.newResearch.principalInvestigatorId,
      teachers: this.selectedTeachers.map(t => t.id),
      students: this.selectedStudents.map(s => s.id),
      fundingAgency: this.newResearch.fundingAgency.trim(),
      budget: Number(this.newResearch.budget) || 0,
      startDate: this.newResearch.startDate || undefined,
      endDate: this.newResearch.endDate || undefined,
      status: this.newResearch.status
    }).subscribe({
      next: () => {
        this.isSaving = false;
        this.closeAddForm();
        // Re-fetch the full list from the backend rather than trusting the optimistic
        // response shape - guarantees what's shown matches what's actually persisted.
        this.loadProjects();
      },
      error: (err) => {
        this.isSaving = false;
        console.error('Failed to create research project:', err);
        this.formError = err?.error?.message || 'Failed to create research project. Please check all required fields and try again.';
      }
    });

  }

}
