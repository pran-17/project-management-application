import { Component } from '@angular/core';
import { Sidebar } from '../../shared/sidebar/sidebar';
import { Header } from '../../shared/header/header';

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
export class Team {

  projectName = 'AI-Based Attendance Management System';

  projectType = 'Team Project';

  guide = 'Dr. Kumar';

  teamId = 'TEAM-2026-014';


  teamMembers: TeamMember[] = [

    {
      name: 'Praneeth',
      registerNumber: 'CSE2026001',
      role: 'Team Leader',
      module: 'Frontend Development',
      progress: 90,
      currentTask: 'Student Dashboard',
      completedTasks: 9,
      pendingTasks: 1,
      status: 'Active',
      initials: 'P'
    },

    {
      name: 'Rahul',
      registerNumber: 'CSE2026002',
      role: 'Team Member',
      module: 'Backend Development',
      progress: 80,
      currentTask: 'Authentication API',
      completedTasks: 8,
      pendingTasks: 2,
      status: 'Active',
      initials: 'R'
    },

    {
      name: 'Arun',
      registerNumber: 'CSE2026003',
      role: 'Team Member',
      module: 'Database Development',
      progress: 95,
      currentTask: 'Database Optimization',
      completedTasks: 10,
      pendingTasks: 0,
      status: 'Completed',
      initials: 'A'
    },

    {
      name: 'Karthik',
      registerNumber: 'CSE2026004',
      role: 'Team Member',
      module: 'Testing & Documentation',
      progress: 60,
      currentTask: 'Integration Testing',
      completedTasks: 5,
      pendingTasks: 4,
      status: 'Active',
      initials: 'K'
    }

  ];


  teamStats = {
    totalMembers: 4,
    averageProgress: 81,
    completedTasks: 32,
    pendingTasks: 7
  };


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