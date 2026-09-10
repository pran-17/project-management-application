import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

import { AuthService } from '../../services/auth.service';

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

  isLoggingIn = false;

  constructor(private router: Router, private authService: AuthService) {}

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

    this.isLoggingIn = true;

    this.authService.login(this.email.trim(), this.password, this.selectedRole).subscribe({
      next: (response) => {

        this.isLoggingIn = false;

        const role = response.user.role;

        if (role === 'student') {
          this.router.navigate(['/student/dashboard']);
        } else if (role === 'teacher') {
          this.router.navigate(['/teacher/dashboard']);
        } else {
          this.router.navigate(['/admin/dashboard']);
        }
      },
      error: (err) => {
        this.isLoggingIn = false;
        this.errorMessage =
          err?.error?.message || 'Invalid email, password or selected role.';
      }
    });
  }
}
