import { Component, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AiChatComponent } from '../ai-chat/ai-chat';
import { AuthService } from '../../services/auth.service';
import { TeacherPortalService } from '../../services/teacher-portal.service';

@Component({
  selector: 'app-teacher-sidebar',
  standalone: true,
  imports: [RouterModule,CommonModule, AiChatComponent],
  templateUrl: './teacher-sidebar.html',
  styleUrl: './teacher-sidebar.css'
})
export class TeacherSidebar implements OnInit {

  isCollapsed = false;

  userName = '';

  userInitial = '';

  constructor(
    private authService: AuthService,
    private teacherPortalService: TeacherPortalService
  ) {}

  ngOnInit(): void {

    const savedState =
      sessionStorage.getItem('teacherSidebarCollapsed');

    if (savedState !== null) {
      this.isCollapsed = savedState === 'true';
    }

    // Show the cached token name immediately (fast, no flicker)
    const user = this.authService.getUser();
    this.userName = user?.name || '';
    this.userInitial = this.userName ? this.userName.charAt(0).toUpperCase() : '?';

    // The cached login name can go stale if the profile is edited later
    // (e.g. by an admin) after the JWT was issued. Fetch the live profile once
    // as the source of truth, rather than only trusting the cached token payload.
    this.teacherPortalService.getMyProfile().subscribe({
      next: (profile) => {
        this.userName = profile.name;
        this.userInitial = profile.name ? profile.name.charAt(0).toUpperCase() : '?';
      },
      error: () => {
        // Fall back silently to the cached token name if the live fetch fails
      }
    });

  }


  toggleSidebar(): void {

    this.isCollapsed = !this.isCollapsed;

    sessionStorage.setItem(
      'teacherSidebarCollapsed',
      this.isCollapsed.toString()
    );

  }

}
