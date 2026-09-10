import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Sidebar } from '../../shared/sidebar/sidebar';
import { Header } from '../../shared/header/header';

import { StudentPortalService } from '../../services/student-portal.service';

interface ProjectPhase {
  name: string;
  description: string;
  startDate: string;
  endDate: string;
  status: 'completed' | 'current' | 'upcoming';
}

export const ROLE_OPTIONS = [
  'Team Lead',
  'Frontend Developer',
  'Backend Developer',
  'Database Developer',
  'UI/UX Designer',
  'Testing',
  'Documentation',
  'Research',
  'Team Member'
];

interface PendingTeamMember {
  registerNumber: string;
  name: string;
  department: string;
  role: string;
  work: string;
}

@Component({
  selector: 'app-project',
  standalone: true,
  imports: [
    FormsModule,
    Sidebar,
    Header
  ],
  templateUrl: './project.html',
  styleUrl: './project.css'
})
export class Project implements OnInit {

  isLoading = false;

  hasProject = false;

  roleOptions = ROLE_OPTIONS;

  // ADD PROJECT FORM STATE
  showAddProjectForm = false;

  isSavingProject = false;

  projectErrorMessage = '';

  newProject = {
    projectTitle: '',
    description: '',
    department: '',
    type: 'Individual' as 'Individual' | 'Team'
  };

  // TEAM MEMBER LOOKUP STATE
  registerNumberInput = '';

  isLookingUpMember = false;

  memberLookupError = '';

  pendingTeamMembers: PendingTeamMember[] = [];

  project = {
    name: 'Not Assigned',

    shortName: '-',

    type: 'Individual',

    category: 'Final Year Project',

    department: '-',

    guide: 'Not Assigned',

    coGuide: '',

    startDate: '-',

    expectedCompletion: '-',

    progress: 0,

    status: 'Not Started',

    teamSize: 0,

    projectId: '-',

    description:
      ''
  };


  objectives: string[] = [];


  technologies: string[] = [];


  // Phase-by-phase timelines aren't modeled on the backend yet (no Phase module),
  // so this stays a placeholder until that's added.
  phases: ProjectPhase[] = [];


  teacherRemarks: { teacher: string; date: string; remark: string }[] = [];

  // Team info once a project exists (role/work per member, from the backend)
  teamMembers: { name: string; registerNumber: string; department: string; role: string; work: string }[] = [];

  constructor(private studentPortalService: StudentPortalService) {}

  ngOnInit(): void {
    this.loadProject();
  }

  loadProject(): void {

    this.isLoading = true;

    this.studentPortalService.getMyProject().subscribe({
      next: (p) => {

        this.isLoading = false;

        if (!p) {
          this.hasProject = false;
          return;
        }

        this.hasProject = true;

        this.project = {
          name: p.title,
          shortName: p.title,
          type: p.type === 'Team' ? 'Team Project' : 'Individual',
          category: 'Final Year Project',
          department: p.department,
          guide: p.guideName,
          coGuide: '',
          startDate: '-',
          expectedCompletion: '-',
          progress: p.progress,
          status: p.status,
          teamSize: p.team.length,
          projectId: p.projectId,
          description: p.description
        };

        this.teamMembers = p.team.map(m => ({
          name: m.name,
          registerNumber: m.registerNumber,
          department: m.department,
          role: m.role,
          work: m.work
        }));
      },
      error: (err) => {
        this.isLoading = false;
        console.error('Failed to load project:', err);
      }
    });

  }

  // Called when the user clicks "+ Add Member" next to the register number field
  addTeamMemberByRegisterNumber(): void {

    this.memberLookupError = '';

    const regNumber = this.registerNumberInput.trim();

    if (!regNumber) {
      this.memberLookupError = 'Please enter a register number.';
      return;
    }

    const alreadyAdded = this.pendingTeamMembers.some(
      m => m.registerNumber.toLowerCase() === regNumber.toLowerCase()
    );
    if (alreadyAdded) {
      this.memberLookupError = `${regNumber} has already been added.`;
      return;
    }

    this.isLookingUpMember = true;

    this.studentPortalService.lookupStudentByRegisterNumber(regNumber).subscribe({
      next: (student) => {
        this.isLookingUpMember = false;

        this.pendingTeamMembers.push({
          registerNumber: student.registerNumber,
          name: student.name,
          department: student.department,
          role: 'Team Member',
          work: ''
        });

        this.registerNumberInput = '';
      },
      error: (err) => {
        this.isLookingUpMember = false;
        this.memberLookupError = err?.error?.message || `Student not found. Register number ${regNumber} does not exist.`;
      }
    });

  }

  removePendingMember(index: number): void {
    this.pendingTeamMembers.splice(index, 1);
  }

  submitProject(): void {

    this.projectErrorMessage = '';

    if (!this.newProject.projectTitle.trim() || !this.newProject.department.trim()) {
      this.projectErrorMessage = 'Please fill in the project title and department.';
      return;
    }

    if (this.newProject.type === 'Team' && this.pendingTeamMembers.length === 0) {
      this.projectErrorMessage = 'A team project needs at least one more team member besides yourself.';
      return;
    }

    this.isSavingProject = true;

    this.studentPortalService.createMyProject({
      projectTitle: this.newProject.projectTitle.trim(),
      description: this.newProject.description.trim(),
      department: this.newProject.department.trim(),
      type: this.newProject.type,
      teamMembers: this.newProject.type === 'Team'
        ? this.pendingTeamMembers.map(m => ({ registerNumber: m.registerNumber, role: m.role, work: m.work }))
        : []
    }).subscribe({
      next: () => {
        this.isSavingProject = false;
        this.showAddProjectForm = false;
        this.newProject = {
          projectTitle: '',
          description: '',
          department: '',
          type: 'Individual'
        };
        this.pendingTeamMembers = [];
        this.registerNumberInput = '';
        // Refresh to show the newly created project
        this.loadProject();
      },
      error: (err) => {
        this.isSavingProject = false;
        this.projectErrorMessage = err?.error?.message || 'Failed to create project. Please try again.';
      }
    });

  }

  getPhaseNumber(index: number): number {
    return index + 1;
  }

}
