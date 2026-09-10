import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { AdminSidebar } from '../../shared/admin-sidebar/admin-sidebar';

import {
  StudentService,
  Student
} from '../../services/student.service';

import {
  TeacherService,
  Teacher
} from '../../services/teacher.service';


@Component({
  selector: 'app-assign-guide',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    AdminSidebar
  ],
  templateUrl: './assign-guide.html',
  styleUrl: './assign-guide.css'
})
export class AssignGuide implements OnInit {

  students: Student[] = [];

  teachers: Teacher[] = [];

  // Keyed by student.id -> selected teacher NAME (template binds to teacher name in the <select>)
  selectedGuides: {
    [key: string]: string
  } = {};


  constructor(
    private studentService: StudentService,
    private teacherService: TeacherService
  ) {}


  ngOnInit(): void {

    this.loadData();

  }


  loadData(): void {

    this.studentService.getStudents().subscribe({
      next: (students) => {
        this.students = students;
      },
      error: (err) => console.error('Failed to load students:', err)
    });

    this.teacherService.getTeachers().subscribe({
      next: (teachers) => {
        this.teachers = teachers;
      },
      error: (err) => console.error('Failed to load teachers:', err)
    });

  }


  get pendingStudents(): Student[] {

    return this.students.filter(
      student =>
        !student.guide ||
        student.guide === '' ||
        student.guide === 'Not Assigned'
    );

  }


  get assignedStudents(): Student[] {

    return this.students.filter(
      student =>
        student.guide &&
        student.guide !== '' &&
        student.guide !== 'Not Assigned'
    );

  }


  assignGuide(student: Student): void {

    const teacherName =
      this.selectedGuides[student.id];


    if (!teacherName) {

      alert('Please select a teacher');

      return;

    }


    const teacher =
      this.teachers.find(
        teacher =>
          teacher.name === teacherName
      );


    if (!teacher) {

      alert('Teacher not found');

      return;

    }


    this.studentService.assignGuide(student.id, teacher.id).subscribe({
      next: (updatedStudent) => {

        student.guide = updatedStudent.guide;
        student.guideId = updatedStudent.guideId;
        student.status = updatedStudent.status;

        alert(
          `${teacher.name} assigned as guide for ${student.name}`
        );

        this.selectedGuides[student.id] = '';

        // Refresh teacher student counts
        this.teacherService.getTeachers().subscribe(teachers => this.teachers = teachers);

      },
      error: (err) => {
        console.error('Failed to assign guide:', err);
        alert(err?.error?.message || 'Failed to assign guide. Please try again.');
      }
    });

  }


  removeGuide(student: Student): void {

    this.studentService.removeGuide(student.id).subscribe({
      next: (updatedStudent) => {
        student.guide = updatedStudent.guide;
        student.guideId = updatedStudent.guideId;
        student.status = updatedStudent.status;

        // Refresh teacher student counts
        this.teacherService.getTeachers().subscribe(teachers => this.teachers = teachers);
      },
      error: (err) => {
        console.error('Failed to remove guide:', err);
        alert('Failed to remove guide. Please try again.');
      }
    });

  }

}
