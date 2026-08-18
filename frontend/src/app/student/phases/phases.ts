import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

import { Sidebar } from '../../shared/sidebar/sidebar';
import { Header } from '../../shared/header/header';


interface ProjectPhase {

  number: number;

  name: string;

  description: string;

  progress: number;

  status: 'Completed' | 'In Progress' | 'Pending';

  startDate: string;

  dueDate: string;

}


@Component({

  selector: 'app-student-phases',

  standalone: true,

  imports: [
    CommonModule,
    Sidebar,
    Header
  ],

  templateUrl: './phases.html',

  styleUrl: './phases.css'

})
export class Phases {


  phases: ProjectPhase[] = [

    {
      number: 1,

      name: 'Research & Planning',

      description:
        'Requirement analysis, literature survey and project planning.',

      progress: 100,

      status: 'Completed',

      startDate: '01 July 2026',

      dueDate: '15 July 2026'
    },


    {
      number: 2,

      name: 'Development',

      description:
        'Frontend, backend, database and application development.',

      progress: 70,

      status: 'In Progress',

      startDate: '16 July 2026',

      dueDate: '31 August 2026'
    },


    {
      number: 3,

      name: 'Testing',

      description:
        'Application testing, bug fixing and performance validation.',

      progress: 20,

      status: 'Pending',

      startDate: '01 September 2026',

      dueDate: '15 September 2026'
    },


    {
      number: 4,

      name: 'Final Submission',

      description:
        'Documentation, presentation and final project submission.',

      progress: 0,

      status: 'Pending',

      startDate: '16 September 2026',

      dueDate: '30 September 2026'
    }

  ];


  getPhaseClass(status: string): string {

    if (status === 'Completed') {
      return 'completed';
    }

    if (status === 'In Progress') {
      return 'active';
    }

    return 'pending';

  }

}