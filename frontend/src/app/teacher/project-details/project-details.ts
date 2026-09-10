import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, ActivatedRoute } from '@angular/router';

import { TeacherSidebar } from '../../shared/teacher-sidebar/teacher-sidebar';
import { Header } from '../../shared/header/header';

import { ProjectService } from '../../services/project.service';

interface TeamMember {
  name: string;
  registerNumber: string;
  role: string;
  module: string;
  progress: number;
  status: string;
}

interface ProjectPhase {
  number: number;
  name: string;
  description: string;
  progress: number;
  status: 'Completed' | 'In Progress' | 'Pending';
  completedDate: string;
}

@Component({
  selector: 'app-project-details',
  standalone: true,

  imports: [
    CommonModule,
    RouterModule,
    TeacherSidebar,
    Header
  ],

  templateUrl: './project-details.html',
  styleUrl: './project-details.css'
})
export class ProjectDetails implements OnInit {

  isLoading = false;

  project = {

    id: '',

    name:
      '',

    projectType:
      'Individual',

    category:
      'Web Application',

    guide:
      'Not Assigned',

    department:
      '',

    startDate:
      '-',

    expectedDate:
      '-',

    overallProgress:
      0,

    currentPhase:
      '-',

    description:
      '',

    objectives: [] as string[]

  };


  constructor(
    private route: ActivatedRoute,
    private projectService: ProjectService
  ) {}


  ngOnInit(): void {

    const dbId = this.route.snapshot.paramMap.get('id') || '';

    if (!dbId) {
      return;
    }

    this.isLoading = true;

    this.projectService.getProjectById(dbId).subscribe({
      next: (p) => {
        this.project.id = p.dbId;
        this.project.name = p.title;
        this.project.projectType = p.students.length > 1 ? 'Team Project' : 'Individual';
        this.project.guide = p.guide;
        this.project.department = p.department;
        this.project.overallProgress = p.progress;
        this.project.currentPhase = p.status;

        this.teamMembers = p.students.map(name => ({
          name,
          registerNumber: '-',
          role: 'Team Member',
          module: '-',
          progress: p.progress,
          status: p.status
        }));

        this.isLoading = false;
      },
      error: (err) => {
        this.isLoading = false;
        console.error('Failed to load project details:', err);
      }
    });

  }


  teamMembers: TeamMember[] = [

    {
      name: 'Praneeth',
      registerNumber: 'CSE2026001',
      role: 'Frontend Developer',
      module: 'Authentication & Dashboard',
      progress: 100,
      status: 'Completed'
    },

    {
      name: 'Rahul',
      registerNumber: 'CSE2026002',
      role: 'Backend Developer',
      module: 'Authentication API',
      progress: 90,
      status: 'In Progress'
    },

    {
      name: 'Karthik',
      registerNumber: 'CSE2026004',
      role: 'Database Developer',
      module: 'Database Design',
      progress: 80,
      status: 'In Progress'
    },

    {
      name: 'Arun',
      registerNumber: 'CSE2026003',
      role: 'Testing',
      module: 'Application Testing',
      progress: 45,
      status: 'In Progress'
    }

  ];


  phases: ProjectPhase[] = [

    {
      number: 1,

      name:
        'Research & Planning',

      description:
        'Requirement analysis, literature survey and project planning.',

      progress: 100,

      status: 'Completed',

      completedDate:
        '15 July 2026'
    },

    {
      number: 2,

      name:
        'Development',

      description:
        'Frontend, backend and database development.',

      progress: 75,

      status: 'In Progress',

      completedDate:
        '-'
    },

    {
      number: 3,

      name:
        'Testing',

      description:
        'System testing, bug fixing and validation.',

      progress: 20,

      status: 'In Progress',

      completedDate:
        '-'
    },

    {
      number: 4,

      name:
        'Final Submission',

      description:
        'Documentation, presentation and final project submission.',

      progress: 0,

      status: 'Pending',

      completedDate:
        '-'
    }

  ];


  getPhaseClass(
    status: string
  ): string {

    switch (status) {

      case 'Completed':
        return 'completed';

      case 'In Progress':
        return 'active';

      default:
        return 'pending';

    }

  }


  getMemberStatusClass(
    status: string
  ): string {

    if (status === 'Completed') {
      return 'completed';
    }

    return 'active';

  }

}