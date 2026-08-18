import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

import { Sidebar } from '../../shared/sidebar/sidebar';
import { Header } from '../../shared/header/header';


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
export class Research {


  researchProject = {

    title:
      'AI-Based Attendance Prediction System',

    researchArea:
      'Artificial Intelligence & Education',

    guide:
      'Dr. Kumar',

    status:
      'Active',

    startDate:
      '01 July 2026',

    expectedCompletion:
      '30 November 2026',

    fundingAgency:
      'Institution Research Fund',

    approvedFunding:
      100000,

    receivedFunding:
      65000,

    spentFunding:
      42000

  };


  researchMembers: ResearchMember[] = [

    {
      name: 'Praneeth',
      registerNumber: 'CSE2026001',
      role: 'Frontend & Data Analysis'
    },

    {
      name: 'Rahul',
      registerNumber: 'CSE2026002',
      role: 'Backend & API'
    },

    {
      name: 'Arun',
      registerNumber: 'CSE2026003',
      role: 'Machine Learning'
    },

    {
      name: 'Karthik',
      registerNumber: 'CSE2026004',
      role: 'Testing & Documentation'
    }

  ];


  milestones: ResearchMilestone[] = [

    {
      title:
        'Literature Survey',

      description:
        'Study existing attendance prediction methods and research papers.',

      progress: 100,

      status: 'Completed',

      dueDate: '20 July 2026'
    },

    {
      title:
        'Data Collection',

      description:
        'Collect and prepare attendance-related datasets.',

      progress: 75,

      status: 'In Progress',

      dueDate: '31 August 2026'
    },

    {
      title:
        'Model Development',

      description:
        'Develop and evaluate the prediction model.',

      progress: 20,

      status: 'In Progress',

      dueDate: '30 September 2026'
    },

    {
      title:
        'Research Report',

      description:
        'Prepare final research findings and documentation.',

      progress: 0,

      status: 'Pending',

      dueDate: '30 November 2026'
    }

  ];


  getRemainingFunding(): number {

    return (
      this.researchProject.receivedFunding -
      this.researchProject.spentFunding
    );

  }


  getFundingPercentage(): number {

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