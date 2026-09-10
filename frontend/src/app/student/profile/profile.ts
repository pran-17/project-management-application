import { Component, OnInit } from '@angular/core';

import { Sidebar } from '../../shared/sidebar/sidebar';
import { Header } from '../../shared/header/header';

import { StudentPortalService } from '../../services/student-portal.service';


@Component({

  selector: 'app-student-profile',

  standalone: true,

  imports: [
    Sidebar,
    Header
  ],

  templateUrl: './profile.html',

  styleUrl: './profile.css'

})
export class Profile implements OnInit {

  isLoading = false;

  student = {

    name: '',

    registerNumber: '',

    email: '',

    phone: '',

    department:
      '',

    year:
      '',

    semester:
      '-',

    project:
      'Not Assigned',

    projectType:
      'Individual',

    guide:
      'Not Assigned',

    role:
      'Team Member'

  };

  constructor(private studentPortalService: StudentPortalService) {}

  ngOnInit(): void {

    this.isLoading = true;

    this.studentPortalService.getMyProfile().subscribe({
      next: (s) => {
        this.student.name = s.name;
        this.student.registerNumber = s.registerNumber;
        this.student.email = s.email;
        this.student.phone = s.phone;
        this.student.department = s.department;
        this.student.year = s.year;
        this.student.guide = s.guide;
        this.student.project = s.project || 'Not Assigned';
        this.isLoading = false;
      },
      error: (err) => {
        this.isLoading = false;
        console.error('Failed to load profile:', err);
      }
    });

  }

}
