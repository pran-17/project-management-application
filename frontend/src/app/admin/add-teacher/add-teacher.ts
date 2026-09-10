import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';

import { AdminSidebar } from '../../shared/admin-sidebar/admin-sidebar';

import {
  TeacherService
} from '../../services/teacher.service';

@Component({
  selector: 'app-add-teacher',
  standalone: true,
  imports: [
    FormsModule,
    RouterLink,
    AdminSidebar
  ],
  templateUrl: './add-teacher.html',
  styleUrl: './add-teacher.css'
})
export class AddTeacher {

  newTeacher = {
    name: '',
    employeeId: '',
    email: '',
    password: '',
    phone: '',
    department: '',
    designation: '',
    specialization: '',
    status: 'Active',
    students: '',
    projects: ''
  };

  isSaving = false;


  constructor(
    private teacherService: TeacherService,
    private router: Router
  ) {}


  saveTeacher(): void {

    if (
      !this.newTeacher.name.trim() ||
      !this.newTeacher.employeeId.trim() ||
      !this.newTeacher.email.trim() ||
      !this.newTeacher.department
    ) {

      alert('Please fill all required fields');
      return;

    }

    this.isSaving = true;

    this.teacherService.addTeacher({
      name: this.newTeacher.name.trim(),
      employeeId: this.newTeacher.employeeId.trim(),
      email: this.newTeacher.email.trim(),
      password: this.newTeacher.password.trim(),
      phone: this.newTeacher.phone.trim(),
      department: this.newTeacher.department,
      designation: this.newTeacher.designation,
      specialization: this.newTeacher.specialization,
      status: this.newTeacher.status || 'Active'
    }).subscribe({
      next: (teacher) => {
        console.log('Teacher added successfully:', teacher);
        this.isSaving = false;

        // IMPORTANT: use the correct existing route
        this.router.navigate(['/admin/teacher']);
      },
      error: (err) => {
        this.isSaving = false;
        const message = err?.error?.message || 'Failed to add teacher. Please try again.';
        alert(message);
        console.error('Add teacher failed:', err);
      }
    });

  }


  cancel(): void {

    this.router.navigate(['/admin/teacher']);

  }

}
