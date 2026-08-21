import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { Header } from '../../shared/header/header';
import { TeacherSidebar } from '../../shared/teacher-sidebar/teacher-sidebar';

@Component({
  selector: 'app-research-details',
  standalone: true,
  imports: [CommonModule, RouterModule, Header, TeacherSidebar],
  templateUrl: './research-details.html',
  styleUrl: './research-details.css'
})
export class ResearchDetails implements OnInit {

  projectId!: number;

  projects: any = {

    1: {
      id: 1,
      area: 'Artificial Intelligence',
      title: 'AI-Based Student Attendance Prediction',
      status: 'Active',
      description:
        'A research project that uses Artificial Intelligence to analyze and predict student attendance patterns.',

      funding: 150000,
      spent: 85000,
      progress: 60,

      supervisor: {
        name: 'Dr. Kumar',
        role: 'Research Supervisor'
      },

      members: [
        {
          name: 'Praneeth',
          id: 'CSE2026001',
          role: 'Team Lead',
          contribution: 'AI Model Development'
        },
        {
          name: 'Rahul',
          id: 'CSE2026002',
          role: 'Research Member',
          contribution: 'Frontend Development'
        },
        {
          name: 'Arun',
          id: 'CSE2026003',
          role: 'Research Member',
          contribution: 'Database Design'
        },
        {
          name: 'Karthik',
          id: 'CSE2026004',
          role: 'Research Member',
          contribution: 'Data Collection'
        }
      ],

      fundProviders: [
        {
          name: 'College Management',
          type: 'Management Funding',
          amount: 100000
        },
        {
          name: 'Tech Innovation Foundation',
          type: 'External Investor',
          amount: 50000
        }
      ],

      milestones: [
        {
          title: 'Research Planning',
          status: 'Completed',
          progress: 100
        },
        {
          title: 'Data Collection',
          status: 'Completed',
          progress: 100
        },
        {
          title: 'AI Model Development',
          status: 'In Progress',
          progress: 60
        },
        {
          title: 'Testing and Final Report',
          status: 'Pending',
          progress: 0
        }
      ]
    },


    2: {
      id: 2,
      area: 'Internet of Things',
      title: 'IoT-Based Smart Campus',
      status: 'Active',
      description:
        'An IoT-based research project for developing smart systems to improve campus management.',

      funding: 200000,
      spent: 95000,
      progress: 45,

      supervisor: {
        name: 'Dr. Priya',
        role: 'Research Supervisor'
      },

      members: [
        {
          name: 'Rahul',
          id: 'CSE2026002',
          role: 'Team Lead',
          contribution: 'IoT Architecture'
        },
        {
          name: 'Arun',
          id: 'CSE2026003',
          role: 'Research Member',
          contribution: 'Sensor Integration'
        },
        {
          name: 'Vijay',
          id: 'CSE2026005',
          role: 'Research Member',
          contribution: 'Backend Development'
        }
      ],

      fundProviders: [
        {
          name: 'College Management',
          type: 'Management Funding',
          amount: 150000
        },
        {
          name: 'Smart Campus Investor',
          type: 'Private Investor',
          amount: 50000
        }
      ],

      milestones: [
        {
          title: 'Research Planning',
          status: 'Completed',
          progress: 100
        },
        {
          title: 'IoT Device Selection',
          status: 'Completed',
          progress: 100
        },
        {
          title: 'System Development',
          status: 'In Progress',
          progress: 45
        },
        {
          title: 'Campus Implementation',
          status: 'Pending',
          progress: 0
        }
      ]
    },


    3: {
      id: 3,
      area: 'Machine Learning',
      title: 'Machine Learning for Academic Performance',
      status: 'Completed',
      description:
        'A machine learning research project for analyzing and predicting academic performance.',

      funding: 100000,
      spent: 92000,
      progress: 100,

      supervisor: {
        name: 'Dr. Suresh',
        role: 'Research Supervisor'
      },

      members: [
        {
          name: 'Arun',
          id: 'CSE2026003',
          role: 'Team Lead',
          contribution: 'Machine Learning Model'
        },
        {
          name: 'Priya',
          id: 'CSE2026006',
          role: 'Research Member',
          contribution: 'Data Analysis'
        }
      ],

      fundProviders: [
        {
          name: 'College Management',
          type: 'Management Funding',
          amount: 100000
        }
      ],

      milestones: [
        {
          title: 'Research Planning',
          status: 'Completed',
          progress: 100
        },
        {
          title: 'Data Analysis',
          status: 'Completed',
          progress: 100
        },
        {
          title: 'Model Development',
          status: 'Completed',
          progress: 100
        },
        {
          title: 'Final Report',
          status: 'Completed',
          progress: 100
        }
      ]
    }
  };

  project: any;

  constructor(private route: ActivatedRoute) {}

  ngOnInit(): void {

    this.projectId = Number(
      this.route.snapshot.paramMap.get('id')
    );

    this.project = this.projects[this.projectId];
  }

}