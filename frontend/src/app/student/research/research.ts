import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';

import { Sidebar } from '../../shared/sidebar/sidebar';
import { Header } from '../../shared/header/header';

import { ResearchService } from '../../services/research.service';


interface ResearchMember {

  name: string;

  registerNumber: string;

  role: string;

}


interface ResearchMilestone {

  title: string;

  description: string;

  progress: number;

  status:
    | 'Completed'
    | 'In Progress'
    | 'Pending';

  dueDate: string;

}


@Component({

  selector: 'app-student-research',

  standalone: true,

  imports: [
    CommonModule,
    Sidebar,
    Header
  ],

  templateUrl: './research.html',

  styleUrl: './research.css'

})
export class Research implements OnInit {

  isLoading = false;

  // True once we know whether the student is on a real research project or not
  hasResearchProject = false;

  researchProject = {

    title:
      'Not Assigned',

    researchArea:
      '-',

    guide:
      'Not Assigned',

    status:
      '-',

    startDate:
      '-',

    expectedCompletion:
      '-',

    fundingAgency:
      '-',

    // Funding breakdown (received/spent) isn't tracked per-student on the backend yet
    // (only a total project budget exists) - these stay placeholders until that's added.
    approvedFunding:
      0,

    receivedFunding:
      0,

    spentFunding:
      0

  };


  researchMembers: ResearchMember[] = [];


  // Milestones aren't modeled on the backend yet (no research-phase module),
  // so this stays a placeholder until that's added.
  milestones: ResearchMilestone[] = [];

  constructor(private researchService: ResearchService) {}

  ngOnInit(): void {

    this.isLoading = true;

    // Backend already filters this to only research projects the logged-in student is part of
    this.researchService.getProjects().subscribe({
      next: (projects) => {

        this.isLoading = false;

        if (!projects || projects.length === 0) {
          this.hasResearchProject = false;
          return;
        }

        this.hasResearchProject = true;

        const project = projects[0];

        this.researchProject = {
          title: project.title,
          researchArea: project.researchArea || '-',
          guide: project.principalInvestigator?.name || 'Not Assigned',
          status: project.status,
          startDate: project.startDate,
          expectedCompletion: project.endDate,
          fundingAgency: project.fundingAgency || '-',
          approvedFunding: project.budget,
          receivedFunding: project.budget,
          spentFunding: 0
        };

        this.researchMembers = project.students.map(s => ({
          name: s.name,
          registerNumber: s.identifier,
          role: 'Research Student'
        }));
      },
      error: (err) => {
        this.isLoading = false;
        console.error('Failed to load research projects:', err);
      }
    });

  }


  getRemainingFunding(): number {

    return (
      this.researchProject.receivedFunding -
      this.researchProject.spentFunding
    );

  }


  getFundingPercentage(): number {

    if (!this.researchProject.receivedFunding) {
      return 0;
    }

    return Math.round(

      (
        this.researchProject.spentFunding /
        this.researchProject.receivedFunding
      ) * 100

    );

  }


  getMilestoneClass(status: string): string {

    if (status === 'Completed') {

      return 'completed';

    }

    if (status === 'In Progress') {

      return 'active';

    }

    return 'pending';

  }

}
