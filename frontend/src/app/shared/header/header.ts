import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  Router,
  NavigationEnd
} from '@angular/router';

import { filter } from 'rxjs/operators';

import { AuthService } from '../../services/auth.service';
import { StudentPortalService } from '../../services/student-portal.service';
import { TeacherPortalService } from '../../services/teacher-portal.service';


@Component({
  selector: 'app-header',

  standalone: true,

  imports: [
    CommonModule
  ],

  templateUrl: './header.html',

  styleUrl: './header.css'
})
export class Header implements OnInit {

  pageTitle = 'Student Dashboard';

  userName = '';

  userRole = 'Student';

  private profileLoaded = false;


  constructor(
    private router: Router,
    private authService: AuthService,
    private studentPortalService: StudentPortalService,
    private teacherPortalService: TeacherPortalService
  ) {}


  ngOnInit(): void {

    this.updateHeader(this.router.url);

    // The cached login name can go stale if the profile is edited later
    // (e.g. by an admin) after the JWT was issued. Fetch the live profile once
    // as the source of truth, rather than only trusting the cached token payload.
    this.loadLiveProfileName();

    this.router.events
      .pipe(
        filter(
          event =>
            event instanceof NavigationEnd
        )
      )
      .subscribe(
        (event: NavigationEnd) => {

          this.updateHeader(
            event.urlAfterRedirects
          );

        }
      );

  }


  private loadLiveProfileName(): void {

    if (this.profileLoaded) {
      return;
    }

    const user = this.authService.getUser();

    if (!user) {
      return;
    }

    if (user.role === 'student') {
      this.studentPortalService.getMyProfile().subscribe({
        next: (profile) => {
          this.profileLoaded = true;
          this.userName = profile.name;
        },
        error: () => {
          // Fall back silently to the cached token name if the live fetch fails
        }
      });
    } else if (user.role === 'teacher') {
      this.teacherPortalService.getMyProfile().subscribe({
        next: (profile) => {
          this.profileLoaded = true;
          this.userName = profile.name;
        },
        error: () => {
          // Fall back silently to the cached token name if the live fetch fails
        }
      });
    }
    // Admin has no separate profile record - the cached token name is already the source of truth.

  }


  private updateHeader(url: string): void {

    // Show the cached token name immediately (fast, no flicker), then
    // loadLiveProfileName() will correct it if it's out of date.
    const user = this.authService.getUser();

    if (!this.profileLoaded) {
      this.userName = user?.name || '';
    }

    if (url.startsWith('/teacher')) {

      this.pageTitle =
        'Teacher Dashboard';

      this.userRole =
        'Project Guide';

    } else if (url.startsWith('/admin')) {

      this.pageTitle =
        'Admin Dashboard';

      this.userRole =
        'Admin';

    } else {

      this.pageTitle =
        'Student Dashboard';

      this.userRole =
        'Student';

    }

  }

}
