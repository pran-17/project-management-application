import { Component, OnInit } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { AiChatComponent } from '../ai-chat/ai-chat';
import { AuthService } from '../../services/auth.service';
import { StudentPortalService } from '../../services/student-portal.service';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [
    RouterLink,
    RouterLinkActive,
    AiChatComponent
  ],
  templateUrl: './sidebar.html',
  styleUrl: './sidebar.css'
})
export class Sidebar implements OnInit {

  userName = '';

  userInitial = '';

  menuItems = [
    {
      label: 'Dashboard',
      icon: '▦',
      route: '/student/dashboard'
    },
    {
      label: 'My Profile',
      icon: '👤',
      route: '/student/profile'
    },
    {
      label: 'My Project',
      icon: '▣',
      route: '/student/project'
    },
    {
      label: 'My Team',
      icon: '👥',
      route: '/student/team'
    },
    {
      label: 'Tasks & Work',
      icon: '✓',
      route: '/student/tasks'
    },
    {
      label: 'Project Phases',
      icon: '◫',
      route: '/student/phases'
    },
    {
      label: 'Documents',
      icon: '▤',
      route: '/student/documents'
    },
    {
      label: 'Research',
      icon: '⌁',
      route: '/student/research'
    }
  ];

  constructor(
    private authService: AuthService,
    private studentPortalService: StudentPortalService
  ) {
    // Show the cached token name immediately (fast, no flicker) - ngOnInit
    // then corrects it with the live profile if it's out of date.
    const user = this.authService.getUser();
    this.userName = user?.name || '';
    this.userInitial = this.userName ? this.userName.charAt(0).toUpperCase() : '?';
  }

  ngOnInit(): void {

    // The cached login name can go stale if the profile is edited later
    // (e.g. by an admin) after the JWT was issued. Fetch the live profile once
    // as the source of truth, rather than only trusting the cached token payload.
    this.studentPortalService.getMyProfile().subscribe({
      next: (profile) => {
        this.userName = profile.name;
        this.userInitial = profile.name ? profile.name.charAt(0).toUpperCase() : '?';
      },
      error: () => {
        // Fall back silently to the cached token name if the live fetch fails
      }
    });

  }

}
