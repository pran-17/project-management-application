import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { AdminSidebar } from '../../shared/admin-sidebar/admin-sidebar';
import { Header } from '../../shared/header/header';

import { ProjectService, Project } from '../../services/project.service';

@Component({
  selector: 'app-admin-projects',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    AdminSidebar,
    Header
  ],
  templateUrl: './projects.html',
  styleUrl: './projects.css'
})
export class Projects implements OnInit {

  showAddProject = false;

  newProject = {
    title: '',
    department: '',
    guide: '',
    status: 'Not Started'
  };

  projects: Project[] = [];

  guides = [
    'Dr. Kumar',
    'Dr. Priya',
    'Dr. Rajesh',
    'Dr. Meena'
  ];

  constructor(private projectService: ProjectService) {}

  ngOnInit(): void {
    this.loadProjects();
  }

  loadProjects(): void {
    this.projectService.getProjects().subscribe({
      next: (projects) => {
        this.projects = projects;
      },
      error: (err) => console.error('Failed to load projects:', err)
    });
  }

  addProject() {

    if (
      !this.newProject.title ||
      !this.newProject.department ||
      !this.newProject.guide
    ) {
      alert('Please fill all required fields.');
      return;
    }

    const projectId = 'PRJ' + Date.now().toString().slice(-6);

    this.projectService.addProject({
      projectId,
      projectTitle: this.newProject.title,
      department: this.newProject.department,
      guideName: this.newProject.guide,
      status: this.newProject.status
    }).subscribe({
      next: (project) => {
        this.projects.unshift(project);

        this.newProject = {
          title: '',
          department: '',
          guide: '',
          status: 'Not Started'
        };

        this.showAddProject = false;

        alert('Project created successfully.');
      },
      error: (err) => {
        console.error('Failed to create project:', err);
        alert(err?.error?.message || 'Failed to create project. Please try again.');
      }
    });
  }

  deleteProject(project: Project) {

    const confirmed = confirm(
      `Are you sure you want to delete "${project.title}"?`
    );

    if (confirmed) {

      this.projectService.deleteProject(project.dbId).subscribe({
        next: () => {
          this.projects = this.projects.filter(
            item => item.dbId !== project.dbId
          );
        },
        error: (err) => {
          console.error('Failed to delete project:', err);
          alert('Failed to delete project. Please try again.');
        }
      });
    }
  }

  getStatusClass(status: string) {

    if (status === 'Completed') {
      return 'completed';
    }

    if (status === 'In Progress') {
      return 'progress';
    }

    return 'not-started';
  }
}
