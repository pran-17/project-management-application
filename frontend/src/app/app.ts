import { Component, signal, OnInit, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { Router, RouterOutlet, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App implements OnInit {
  protected readonly title = signal('projectmanagement');

  constructor(
    private router: Router,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {}

  ngOnInit(): void {
    // Applies a body-level theme class (theme-admin / theme-teacher / theme-student)
    // based on the current route, so shared components (like the header) can pick up
    // the right role accent color via CSS variables without any change to routing,
    // navigation, or component logic.
    this.applyThemeClass(this.router.url);

    this.router.events
      .pipe(filter((event): event is NavigationEnd => event instanceof NavigationEnd))
      .subscribe((event) => this.applyThemeClass(event.urlAfterRedirects));

    // Add card click animations
    if (isPlatformBrowser(this.platformId)) {
      this.initializeCardAnimations();
    }
  }

  private initializeCardAnimations(): void {
    document.addEventListener('click', (event) => {
      const target = (event.target as HTMLElement).closest(
        '.stat-card, .summary-card, .assignment-card, .action-card, .student-item, .project-item, .teacher-card'
      );
      
      if (target) {
        target.classList.add('card-clicked');
        setTimeout(() => {
          target.classList.remove('card-clicked');
        }, 400);
      }
    });
  }

  private applyThemeClass(url: string): void {
    if (!isPlatformBrowser(this.platformId)) {
      return;
    }

    const body = document.body;
    body.classList.remove('theme-admin', 'theme-teacher', 'theme-student');

    if (url.startsWith('/teacher')) {
      body.classList.add('theme-teacher');
    } else if (url.startsWith('/student')) {
      body.classList.add('theme-student');
    } else if (url.startsWith('/admin')) {
      body.classList.add('theme-admin');
    }
  }
}
