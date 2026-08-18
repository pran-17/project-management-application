import { Component } from '@angular/core';
import { Sidebar } from '../../shared/sidebar/sidebar';
import { Header } from '../../shared/header/header';

interface TeamMember {
  name: string;
  role: string;
  progress: number;
  initials: string;
  status: string;
}

interface ProjectPhase {
  name: string;
  description: string;
  startDate: string;
  endDate: string;
  status: 'completed' | 'current' | 'upcoming';
}

@Component({
  selector: 'app-project',
  standalone: true,
  imports: [
    Sidebar,
    Header
  ],
  templateUrl: './project.html',
  styleUrl: './project.css'
})
export class Project {

  project = {
    name: 'AI-Based Attendance Management System',

    shortName: 'AI Attendance',

    type: 'Team Project',

    category: 'Final Year Project',

    department: 'Computer Science & Engineering',

    guide: 'Dr. Kumar',

    coGuide: 'Dr. Priya',

    startDate: '10 June 2026',

    expectedCompletion: '30 November 2026',

    progress: 68,

    status: 'In Progress',

    teamSize: 4,

    projectId: 'FYP-2026-014',

    description:
      'An intelligent attendance management system that uses artificial intelligence and face recognition technology to automate student attendance and provide real-time academic attendance reports.'
  };


  objectives = [

    'Automate student attendance using face recognition.',

    'Reduce manual attendance recording by teachers.',

    'Provide real-time attendance reports.',

    'Allow students to monitor their attendance.',

    'Provide secure and centralized attendance data.'

  ];


  technologies = [

    'Angular',

    'Node.js',

    'Express.js',

    'MongoDB',

    'TypeScript',

    'Python',

    'AI / Machine Learning'

  ];




  phases: ProjectPhase[] = [

    {
      name: 'Phase 1 - Research & Planning',
      description:
        'Requirement analysis, literature survey and project planning.',
      startDate: '10 June 2026',
      endDate: '30 June 2026',
      status: 'completed'
    },

    {
      name: 'Phase 2 - System Development',
      description:
        'Frontend, backend and database development.',
      startDate: '01 July 2026',
      endDate: '31 August 2026',
      status: 'current'
    },

    {
      name: 'Phase 3 - Testing',
      description:
        'System testing, bug fixing and performance validation.',
      startDate: '01 September 2026',
      endDate: '30 September 2026',
      status: 'upcoming'
    },

    {
      name: 'Final Submission',
      description:
        'Final documentation, presentation and project submission.',
      startDate: '01 October 2026',
      endDate: '30 November 2026',
      status: 'upcoming'
    }

  ];


  teacherRemarks = [

    {
      teacher: 'Dr. Kumar',

      date: '13 August 2026',

      remark:
        'Good progress on the development phase. Continue with the remaining backend integration work.'
    },

    {
      teacher: 'Dr. Kumar',

      date: '05 August 2026',

      remark:
        'The database design and project architecture have been approved.'
    }

  ];


  getPhaseNumber(index: number): number {
    return index + 1;
  }

}