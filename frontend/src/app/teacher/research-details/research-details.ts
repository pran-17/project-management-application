import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { Header } from '../../shared/header/header';
import { TeacherSidebar } from '../../shared/teacher-sidebar/teacher-sidebar';

import { ResearchService } from '../../services/research.service';

@Component({
  selector: 'app-research-details',
  standalone: true,
  imports: [CommonModule, RouterModule, Header, TeacherSidebar],
  templateUrl: './research-details.html',
  styleUrl: './research-details.css'
})
export class ResearchDetails implements OnInit {

  projectId!: string;

  isLoading = false;

  project: any = null;

  constructor(private route: ActivatedRoute, private researchService: ResearchService) {}

  ngOnInit(): void {

    this.projectId = this.route.snapshot.paramMap.get('id') || '';

    if (!this.projectId) {
      return;
    }

    this.isLoading = true;

    // Backend enforces access here too - a teacher who isn't the PI or a research
    // teacher on this project will get a 403, not the data.
    this.researchService.getProjectById(this.projectId).subscribe({
      next: (p) => {
        this.isLoading = false;

        this.project = {
          title: p.title,
          description: p.description || 'No description provided.',
          status: p.status,
          area: p.researchArea || p.department,
          progress: p.progress,

          supervisor: {
            name: p.principalInvestigator?.name || 'Not Assigned',
            role: 'Principal Investigator'
          },

          members: p.students.map(s => ({
            id: s.identifier,
            name: s.name,
            role: 'Research Student',
            // Per-member contribution notes aren't modeled on the backend yet
            contribution: '-'
          })),

          funding: p.budget,
          // Fund utilization isn't tracked per research project on the backend yet
          spent: 0,
          fundProviders: p.fundingAgency
            ? [{ name: p.fundingAgency, amount: p.budget }]
            : [],

          // Milestones aren't modeled on the backend yet (no research-phase module)
          milestones: []
        };
      },
      error: (err) => {
        this.isLoading = false;
        console.error('Failed to load research project details:', err);
      }
    });

  }

}
