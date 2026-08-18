import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  Router,
  NavigationEnd
} from '@angular/router';

import { filter } from 'rxjs/operators';


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

  userName = 'Praneeth';

  userRole = 'Student';


  constructor(
    private router: Router
  ) {}


  ngOnInit(): void {

    this.updateHeader(this.router.url);


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


  private updateHeader(url: string): void {

    if (url.startsWith('/teacher')) {

      this.pageTitle =
        'Teacher Dashboard';

      this.userName =
        'Dr. Kumar';

      this.userRole =
        'Project Guide';

    } else {

      this.pageTitle =
        'Student Dashboard';

      this.userName =
        'Praneeth';

      this.userRole =
        'Student';

    }

  }

}