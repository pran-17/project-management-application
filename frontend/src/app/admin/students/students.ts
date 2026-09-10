import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';

import { AdminSidebar } from '../../shared/admin-sidebar/admin-sidebar';

import {
  StudentService,
  Student
} from '../../services/student.service';

@Component({
  selector: 'app-admin-students',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    AdminSidebar,
    RouterLink
  ],
  templateUrl: './students.html',
  styleUrl: './students.css'
})
export class Students implements OnInit {

  searchText = '';

  students: Student[] = [];

  isLoading = false;


  constructor(
    private studentService: StudentService
  ) {}


  ngOnInit(): void {

    this.loadStudents();

  }


  loadStudents(): void {

    this.isLoading = true;

    this.studentService.getStudents().subscribe({
      next: (students) => {
        this.students = students;
        this.isLoading = false;
      },
      error: (err) => {
        this.isLoading = false;
        console.error('Failed to load students:', err);
      }
    });

  }


  get filteredStudents(): Student[] {

    const search = this.searchText.toLowerCase();

    return this.students.filter(student =>
      student.name.toLowerCase().includes(search) ||
      student.registerNumber.toLowerCase().includes(search) ||
      student.department.toLowerCase().includes(search) ||
      student.email.toLowerCase().includes(search)
    );

  }


  get activeStudentsCount(): number {

    return this.students.filter(
      student => student.status === 'Active'
    ).length;

  }


  get pendingGuideCount(): number {

    return this.students.filter(
      student => student.guide === 'Not Assigned'
    ).length;

  }


  deleteStudent(id: string): void {

    const confirmed = confirm('Are you sure you want to delete this student?');

    if (!confirmed) {
      return;
    }

    this.studentService.deleteStudent(id).subscribe({
      next: () => {
        this.loadStudents();
      },
      error: (err) => {
        console.error('Failed to delete student:', err);
        alert('Failed to delete student. Please try again.');
      }
    });

  }

}
