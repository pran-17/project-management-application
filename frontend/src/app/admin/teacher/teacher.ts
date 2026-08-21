import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { AdminSidebar } from '../../shared/admin-sidebar/admin-sidebar';
import { Header } from '../../shared/header/header';

@Component({
  selector: 'app-teachers',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    AdminSidebar,
    Header
  ],
  templateUrl: './teacher.html',
  styleUrl: './teacher.css'
})
export class Teachers {

  searchText = '';
  selectedDepartment = 'All';

  showAddTeacher = false;

  teachers = [
    {
      id: 1,
      name: 'Dr. Kumar',
      employeeId: 'TCH2026001',
      email: 'kumar@college.edu',
      department: 'Computer Science',
      specialization: 'Artificial Intelligence',
      students: 4,
      projects: 2,
      status: 'Active'
    },
    {
      id: 2,
      name: 'Dr. Priya',
      employeeId: 'TCH2026002',
      email: 'priya@college.edu',
      department: 'Information Technology',
      specialization: 'Web Development',
      students: 5,
      projects: 3,
      status: 'Active'
    },
    {
      id: 3,
      name: 'Prof. Rajesh',
      employeeId: 'TCH2026003',
      email: 'rajesh@college.edu',
      department: 'Computer Science',
      specialization: 'Database Systems',
      students: 3,
      projects: 1,
      status: 'Active'
    },
    {
      id: 4,
      name: 'Dr. Anitha',
      employeeId: 'TCH2026004',
      email: 'anitha@college.edu',
      department: 'Electronics',
      specialization: 'Internet of Things',
      students: 2,
      projects: 1,
      status: 'Inactive'
    }
  ];

  newTeacher = {
    name: '',
    employeeId: '',
    email: '',
    department: '',
    specialization: ''
  };

  get filteredTeachers() {
    return this.teachers.filter(teacher => {

      const matchesSearch =
        teacher.name.toLowerCase().includes(this.searchText.toLowerCase()) ||
        teacher.employeeId.toLowerCase().includes(this.searchText.toLowerCase()) ||
        teacher.email.toLowerCase().includes(this.searchText.toLowerCase());

      const matchesDepartment =
        this.selectedDepartment === 'All' ||
        teacher.department === this.selectedDepartment;

      return matchesSearch && matchesDepartment;
    });
  }

  openAddTeacher() {
    this.showAddTeacher = true;
  }

  closeAddTeacher() {
    this.showAddTeacher = false;

    this.newTeacher = {
      name: '',
      employeeId: '',
      email: '',
      department: '',
      specialization: ''
    };
  }

  addTeacher() {

    if (
      !this.newTeacher.name ||
      !this.newTeacher.employeeId ||
      !this.newTeacher.email ||
      !this.newTeacher.department
    ) {
      alert('Please fill all required fields');
      return;
    }

    this.teachers.push({
      id: Date.now(),
      name: this.newTeacher.name,
      employeeId: this.newTeacher.employeeId,
      email: this.newTeacher.email,
      department: this.newTeacher.department,
      specialization: this.newTeacher.specialization,
      students: 0,
      projects: 0,
      status: 'Active'
    });

    this.closeAddTeacher();
  }

  toggleStatus(teacher: any) {

    teacher.status =
      teacher.status === 'Active'
        ? 'Inactive'
        : 'Active';
  }

  deleteTeacher(id: number) {

    const confirmed =
      confirm('Are you sure you want to remove this teacher?');

    if (confirmed) {
      this.teachers =
        this.teachers.filter(
          teacher => teacher.id !== id
        );
    }
  }

  viewTeacher(teacher: any) {

    alert(
      `Teacher: ${teacher.name}\n` +
      `Students: ${teacher.students}\n` +
      `Projects: ${teacher.projects}`
    );
  }
}