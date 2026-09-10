import { Component, signal, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { CommonModule } from '@angular/common';
import { RouterLink,RouterLinkActive } from '@angular/router';
import { AiChatComponent } from '../ai-chat/ai-chat';

@Component({
  selector: 'app-admin-sidebar',
  imports: [CommonModule, RouterLink, RouterLinkActive, AiChatComponent],
  templateUrl: './admin-sidebar.html',
  styleUrl: './admin-sidebar.css',
})
export class AdminSidebar {
  sidebarOpen = signal(true);

  constructor(@Inject(PLATFORM_ID) private platformId: Object) {}

  toggleSidebar(): void {
    this.sidebarOpen.update(value => !value);
    
    if (isPlatformBrowser(this.platformId)) {
      const mainElement = document.querySelector('.admin-main');
      if (mainElement) {
        mainElement.classList.toggle('sidebar-collapsed');
      }
    }
  }
}
