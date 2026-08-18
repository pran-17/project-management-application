import { Component } from '@angular/core';

import { Sidebar } from '../../shared/sidebar/sidebar';
import { Header } from '../../shared/header/header';


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
export class Profile {


  student = {

    name: 'Praneeth',

    registerNumber: 'CSE2026001',

    email: 'praneeth@example.com',

    phone: '9876543210',

    department:
      'Computer Science and Engineering',

    year:
      'Final Year',

    semester:
      'Semester 8',

    project:
      'AI-Based Attendance Management System',

    projectType:
      'Team Project',

    guide:
      'Dr. Kumar',

    role:
      'Frontend Developer'

  };

}