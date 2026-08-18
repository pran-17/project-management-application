import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

type UserRole = 'student' | 'teacher' | 'admin';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule
  ],
  templateUrl: './login.html',
  styleUrl: './login.css'
})
export class Login {

  email = '';
  password = '';

  selectedRole: UserRole = 'student';

  rememberMe = false;

  errorMessage = '';

  constructor(private router: Router) {}

  selectRole(role: UserRole): void {
    this.selectedRole = role;
    this.errorMessage = '';
  }

  login(): void {

    this.errorMessage = '';

    if (!this.email.trim()) {
      this.errorMessage = 'Please enter your email address.';
      return;
    }

    if (!this.password.trim()) {
      this.errorMessage = 'Please enter your password.';
      return;
    }

    const users = {
      student: {
        email: 'student@test.com',
        password: '123456'
      },

      teacher: {
        email: 'teacher@test.com',
        password: '123456'
      },

      admin: {
        email: 'admin@test.com',
        password: '123456'
      }
    };

    const user = users[this.selectedRole];

    if (
      this.email.trim().toLowerCase() === user.email &&
      this.password === user.password
    ) {

      if (this.selectedRole === 'student') {
        this.router.navigate(['/student/dashboard']);
      }

      else if (this.selectedRole === 'teacher') {
        this.router.navigate(['/teacher/dashboard']);
      }

      else {
        this.router.navigate(['/admin/dashboard']);
      }

    } else {

      this.errorMessage =
        'Invalid email, password or selected role.';
    }
  }
}