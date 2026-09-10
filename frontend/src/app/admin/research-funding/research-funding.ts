import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';

import { AdminSidebar } from '../../shared/admin-sidebar/admin-sidebar';

import {
  ResearchFundingService,
  ResearchFunding
} from '../../services/research-funding.service';

@Component({
  selector: 'app-research-funding',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    RouterLink,
    AdminSidebar
  ],
  templateUrl: './research-funding.html',
  styleUrl: './research-funding.css'
})
export class ResearchFundingComponent implements OnInit {

  searchText = '';

  fundings: ResearchFunding[] = [];

  constructor(
    private researchFundingService: ResearchFundingService
  ) {}

  ngOnInit(): void {
    this.loadFunding();
  }

  loadFunding(): void {
    this.researchFundingService.getFunding().subscribe({
      next: (fundings) => {
        this.fundings = fundings;
      },
      error: (err) => console.error('Failed to load funding records:', err)
    });
  }


  get filteredFundings(): ResearchFunding[] {

    const search = this.searchText
      .toLowerCase()
      .trim();

    return this.fundings.filter(funding =>
      funding.projectTitle.toLowerCase().includes(search) ||
      funding.principalInvestigator.toLowerCase().includes(search) ||
      funding.department.toLowerCase().includes(search) ||
      funding.fundingAgency.toLowerCase().includes(search) ||
      funding.fundingId.toLowerCase().includes(search)
    );
  }


  get totalFunding(): number {

    return this.fundings.reduce(
      (total: number, funding: ResearchFunding) =>
        total + funding.totalAmount,
      0
    );
  }


  get utilizedFunding(): number {

    return this.fundings.reduce(
      (total: number, funding: ResearchFunding) =>
        total + funding.utilizedAmount,
      0
    );
  }


  get remainingFunding(): number {

    return this.fundings.reduce(
      (total: number, funding: ResearchFunding) =>
        total + funding.remainingAmount,
      0
    );
  }


  get activeFundingCount(): number {

    return this.fundings.filter(
      funding => funding.status === 'Active'
    ).length;
  }


  getUtilizationPercentage(
    funding: ResearchFunding
  ): number {

    if (funding.totalAmount === 0) {
      return 0;
    }

    return Math.round(
      (funding.utilizedAmount / funding.totalAmount) * 100
    );
  }


  deleteFunding(id: string): void {

    this.researchFundingService.deleteFunding(id).subscribe({
      next: () => {
        this.fundings = this.fundings.filter(funding => funding.id !== id);
      },
      error: (err) => {
        console.error('Failed to delete funding record:', err);
        alert('Failed to delete funding record. Please try again.');
      }
    });
  }

}
