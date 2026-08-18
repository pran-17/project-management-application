import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [
    RouterLink,
    RouterLinkActive
  ],
  templateUrl: './sidebar.html',
  styleUrl: './sidebar.css'
})
export class Sidebar {

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

}