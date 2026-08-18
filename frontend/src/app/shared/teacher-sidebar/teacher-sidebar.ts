import { Component, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-teacher-sidebar',
  standalone: true,
  imports: [RouterModule],
  templateUrl: './teacher-sidebar.html',
  styleUrl: './teacher-sidebar.css'
})
export class TeacherSidebar implements OnInit {

  isCollapsed = false;

  ngOnInit(): void {

    const savedState =
      localStorage.getItem('teacherSidebarCollapsed');

    if (savedState !== null) {
      this.isCollapsed = savedState === 'true';
    }

  }


  toggleSidebar(): void {

    this.isCollapsed = !this.isCollapsed;

    localStorage.setItem(
      'teacherSidebarCollapsed',
      this.isCollapsed.toString()
    );

  }

}