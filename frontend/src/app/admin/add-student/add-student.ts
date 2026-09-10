import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AdminSidebar } from '../../shared/admin-sidebar/admin-sidebar';

import {
  StudentService
} from '../../services/student.service';

@Component({
  selector: 'app-add-student',
  standalone: true,
  imports: [
    FormsModule,
    AdminSidebar
  ],
  templateUrl: './add-student.html',
  styleUrl: './add-student.css'
})
export class AddStudent {

  newStudent = {
    name: '',
    registerNumber: '',
    email: '',
    password:'',
    department: '',
    phone: '',
    year: '',
    status: '',
    guide: '',
    project: ''
  };

  isSaving = false;
  errorMessage = '';

  constructor(
    private studentService: StudentService,
    private router: Router
  ) {}

  saveStudent(): void {

    if (
      !this.newStudent.name.trim() ||
      !this.newStudent.registerNumber.trim() ||
      !this.newStudent.email.trim() ||
      !this.newStudent.department
    ) {
      alert('Please fill all required fields');
      return;
    }

    this.isSaving = true;
    this.errorMessage = '';

    this.studentService.addStudent({
      name: this.newStudent.name.trim(),
      registerNumber: this.newStudent.registerNumber.trim(),
      email: this.newStudent.email.trim(),
      password:this.newStudent.password.trim(),
      department: this.newStudent.department,
      phone: this.newStudent.phone,
      year: this.newStudent.year,
      status: this.newStudent.status || 'Pending',
      project: this.newStudent.project || 'Not Assigned'
    }).subscribe({
      next: (student) => {
        console.log('Student added successfully:', student);
        this.isSaving = false;
        // Go to Students page after saving
        this.router.navigate(['/admin/students']);
      },
      error: (err) => {
        this.isSaving = false;
        this.errorMessage = err?.error?.message || 'Failed to add student. Please try again.';
        alert(this.errorMessage);
        console.error('Add student failed:', err);
      }
    });
  }


  // CANCEL BUTTON
  cancel(): void {

    // Go back without saving
    this.router.navigate(['/admin/students']);

  }

}
