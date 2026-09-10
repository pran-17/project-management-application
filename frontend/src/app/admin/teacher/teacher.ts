import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { Header } from '../../shared/header/header';
import { AdminSidebar } from '../../shared/admin-sidebar/admin-sidebar';

import {
  TeacherService,
  Teacher
} from '../../services/teacher.service';

@Component({
  selector: 'app-teachers',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    RouterLink,
    AdminSidebar,
    Header
  ],
  templateUrl: './teacher.html',
  styleUrl: './teacher.css'
})
export class Teachers implements OnInit {

  searchText = '';

  selectedDepartment = 'All';

  teachers: Teacher[] = [];


  constructor(
    private teacherService: TeacherService
  ) {}


  ngOnInit(): void {

    this.loadTeachers();

  }


  loadTeachers(): void {

    this.teacherService.getTeachers().subscribe({
      next: (teachers) => {
        this.teachers = teachers;
      },
      error: (err) => {
        console.error('Failed to load teachers:', err);
      }
    });

  }


  get filteredTeachers(): Teacher[] {

    const search =
      this.searchText.toLowerCase().trim();

    return this.teachers.filter(teacher => {

      const matchesSearch =
        teacher.name.toLowerCase().includes(search) ||
        teacher.employeeId.toLowerCase().includes(search) ||
        teacher.department.toLowerCase().includes(search) ||
        teacher.email.toLowerCase().includes(search);

      const matchesDepartment =
        this.selectedDepartment === 'All' ||
        teacher.department === this.selectedDepartment;

      return matchesSearch && matchesDepartment;

    });

  }


  get activeTeachersCount(): number {

    return this.teachers.filter(
      teacher => teacher.status === 'Active'
    ).length;

  }


get assignedStudentsCount(): number {

  return this.teachers.reduce(
    (total, teacher) => total + Number(teacher.students || 0),
    0
  );

}


get activeProjectsCount(): number {

  return this.teachers.reduce(
    (total, teacher) => total + Number(teacher.projects || 0),
    0
  );

}


  viewTeacher(teacher: Teacher): void {

    alert(
      'Teacher Details\n\n' +
      'Name: ' + teacher.name + '\n' +
      'Employee ID: ' + teacher.employeeId + '\n' +
      'Department: ' + teacher.department + '\n' +
      'Specialization: ' + teacher.specialization + '\n' +
      'Email: ' + teacher.email
    );

  }


  // ADD THIS METHOD
  toggleStatus(teacher: Teacher): void {

    this.teacherService.toggleStatus(teacher.id).subscribe({
      next: (updated) => {
        teacher.status = updated.status;
      },
      error: (err) => {
        console.error('Failed to toggle teacher status:', err);
        alert('Failed to update teacher status. Please try again.');
      }
    });

  }


  deleteTeacher(id: string): void {

    const confirmed =
      confirm('Are you sure you want to delete this teacher?');

    if (!confirmed) {
      return;
    }

    this.teacherService.deleteTeacher(id).subscribe({
      next: () => {
        this.loadTeachers();
      },
      error: (err) => {
        console.error('Failed to delete teacher:', err);
        alert('Failed to delete teacher. Please try again.');
      }
    });

  }

}
