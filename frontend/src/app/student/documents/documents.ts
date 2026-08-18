import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

import { Sidebar } from '../../shared/sidebar/sidebar';
import { Header } from '../../shared/header/header';


interface ProjectDocument {

  id: number;

  name: string;

  type: string;

  phase: string;

  version: string;

  uploadedDate: string;

  size: string;

  status:
    | 'Approved'
    | 'Under Review'
    | 'Changes Requested';

  teacherRemark: string;

}


@Component({

  selector: 'app-student-documents',

  standalone: true,

  imports: [
    CommonModule,
    Sidebar,
    Header
  ],

  templateUrl: './documents.html',

  styleUrl: './documents.css'

})
export class Documents {


  documents: ProjectDocument[] = [

    {
      id: 1,

      name: 'Project Proposal',

      type: 'PDF',

      phase: 'Phase 1',

      version: 'v1.0',

      uploadedDate: '05 July 2026',

      size: '2.4 MB',

      status: 'Approved',

      teacherRemark:
        'Proposal approved. Continue with the development phase.'
    },


    {
      id: 2,

      name: 'Literature Survey',

      type: 'PDF',

      phase: 'Phase 1',

      version: 'v1.0',

      uploadedDate: '12 July 2026',

      size: '3.1 MB',

      status: 'Approved',

      teacherRemark:
        'Literature survey reviewed successfully.'
    },


    {
      id: 3,

      name: 'System Design Document',

      type: 'PDF',

      phase: 'Phase 2',

      version: 'v1.1',

      uploadedDate: '05 Aug 2026',

      size: '4.8 MB',

      status: 'Under Review',

      teacherRemark:
        'Document submitted and waiting for review.'
    },


    {
      id: 4,

      name: 'Phase 2 Progress Report',

      type: 'PDF',

      phase: 'Phase 2',

      version: 'v1.0',

      uploadedDate: '13 Aug 2026',

      size: '2.1 MB',

      status: 'Changes Requested',

      teacherRemark:
        'Please add the latest database implementation details.'
    }

  ];


  selectedFilter = 'All';


  get filteredDocuments(): ProjectDocument[] {

    if (this.selectedFilter === 'All') {

      return this.documents;

    }

    return this.documents.filter(
      document =>
        document.status === this.selectedFilter
    );

  }


  getStatusClass(status: string): string {

    if (status === 'Approved') {

      return 'approved';

    }

    if (status === 'Changes Requested') {

      return 'changes';

    }

    return 'review';

  }


  getApprovedCount(): number {

    return this.documents.filter(
      document =>
        document.status === 'Approved'
    ).length;

  }


  getReviewCount(): number {

    return this.documents.filter(
      document =>
        document.status === 'Under Review'
    ).length;

  }


  getChangesCount(): number {

    return this.documents.filter(
      document =>
        document.status === 'Changes Requested'
    ).length;

  }

}