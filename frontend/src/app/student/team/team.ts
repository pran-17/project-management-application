import { Component, OnInit } from '@angular/core';
import { Sidebar } from '../../shared/sidebar/sidebar';
import { Header } from '../../shared/header/header';

import { StudentPortalService } from '../../services/student-portal.service';

interface TeamMember {
  name: string;
  registerNumber: string;
  role: string;
  module: string;
  progress: number;
  currentTask: string;
  completedTasks: number;
  pendingTasks: number;
  status: 'Active' | 'Completed' | 'Delayed';
  initials: string;
}

@Component({
  selector: 'app-team',
  standalone: true,
  imports: [
    Sidebar,
    Header
  ],
  templateUrl: './team.html',
  styleUrl: './team.css'
})
export class Team implements OnInit {

  projectName = 'Not Assigned';

  projectType = 'Individual';

  guide = 'Not Assigned';

  teamId = '-';

  isLoading = false;

  teamMembers: TeamMember[] = [];

  teamStats = {
    totalMembers: 0,
    averageProgress: 0,
    completedTasks: 0,
    pendingTasks: 0
  };

  constructor(private studentPortalService: StudentPortalService) {}

  ngOnInit(): void {

    this.isLoading = true;

    this.studentPortalService.getMyProject().subscribe({
      next: (project) => {

        this.isLoading = false;

        if (!project) {
          return;
        }

        this.projectName = project.title;
        this.projectType = project.team.length > 1 ? 'Team Project' : 'Individual';
        this.guide = project.guideName;
        this.teamId = project.projectId;

        // Per-member task/progress tracking isn't modeled on the backend yet
        // (no Task module), so progress/tasks use the project's overall progress
        // as a stand-in until task tracking is added. Role and work/responsibility
        // now come directly from the project's real team assignment data.
        this.teamMembers = project.team.map(member => ({
          name: member.name,
          registerNumber: member.registerNumber,
          role: member.role || 'Team Member',
          module: member.work || '-',
          progress: project.progress,
          currentTask: member.work || '-',
          completedTasks: 0,
          pendingTasks: 0,
          status: project.status === 'Completed' ? 'Completed' : 'Active',
          initials: member.name.charAt(0).toUpperCase()
        }));

        this.teamStats = {
          totalMembers: this.teamMembers.length,
          averageProgress: project.progress,
          completedTasks: 0,
          pendingTasks: 0
        };
      },
      error: (err) => {
        this.isLoading = false;
        console.error('Failed to load team:', err);
      }
    });

  }

  getStatusClass(status: string): string {

    if (status === 'Completed') {
      return 'completed';
    }

    if (status === 'Delayed') {
      return 'delayed';
    }

    return 'active';
  }

}
