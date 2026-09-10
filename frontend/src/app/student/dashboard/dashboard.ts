import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

import { Sidebar } from '../../shared/sidebar/sidebar';
import { Header } from '../../shared/header/header';

import { AuthService } from '../../services/auth.service';
import { StudentPortalService } from '../../services/student-portal.service';
import { TaskService } from '../../services/task.service';
import { PhaseService } from '../../services/phase.service';

interface TimelineItem { title: string; date: string; status: 'completed' | 'current' | 'upcoming'; }
interface ActivityItem { task: string; description: string; date: string; status: string; }
interface RemarkItem { teacher: string; remark: string; date: string; }
interface TeamMemberItem { name: string; role: string; work: string; initial: string; }

// Demo fallbacks shown ONLY in the UI when the student has no real data yet.
// Never written to MongoDB - purely a frontend display fallback per product spec.
const DEMO_TIMELINE: TimelineItem[] = [
  { title: 'Phase 1 – Planning', date: 'Jun 10 – Jun 20', status: 'completed' },
  { title: 'Phase 2 – Development', date: 'Jun 21 – Jul 20', status: 'current' },
  { title: 'Phase 3 – Testing', date: 'Jul 21 – Aug 05', status: 'upcoming' },
  { title: 'Phase 4 – Final Review', date: 'Aug 06 – Aug 15', status: 'upcoming' }
];

const DEMO_ACTIVITY: ActivityItem[] = [
  { task: 'Login Module', description: 'You updated "Login Module"', date: '2 hours ago', status: 'Approved' },
  { task: 'Database Design', description: 'Teacher reviewed "Database Design"', date: 'Yesterday', status: 'Approved' },
  { task: 'API Integration', description: '"API Integration" is waiting for review', date: '2 days ago', status: 'Pending Review' },
  { task: 'Phase 1', description: 'Project Phase 1 completed', date: '3 days ago', status: 'Approved' }
];

const DEMO_REMARKS: RemarkItem[] = [
  { teacher: 'Guide', remark: 'Good progress. Please complete the validation section.', date: 'Today' },
  { teacher: 'Guide', remark: 'Add error handling to the login API before resubmitting.', date: 'Yesterday' }
];

const DEMO_TEAM: TeamMemberItem[] = [
  { name: 'Praneeth', role: 'Frontend Developer', work: '90%', initial: 'P' },
  { name: 'Rahul', role: 'Backend Developer', work: '80%', initial: 'R' },
  { name: 'Arun', role: 'Database Developer', work: '95%', initial: 'A' },
  { name: 'Karthik', role: 'Testing', work: '60%', initial: 'K' }
];

@Component({
  selector: 'app-student-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    Sidebar,
    Header
  ],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css'
})
export class Dashboard implements OnInit {

  studentName = '';

  isUsingDemoProject = false;

  project = {
    title: 'Smart Campus Management System',
    type: 'Team Project',
    guide: 'Dr. Rajesh Kumar',
    progress: 83,
    currentPhase: 'Phase 2 – Development',
    teamMembers: 4,
    pendingReviews: 1
  };


  // DASHBOARD STAT CARDS
  stats = [
    { title: 'Project Progress', value: '83%', description: 'Overall completion', icon: '◔', link: '/student/project' },
    { title: 'Current Phase', value: 'Phase 2', description: 'Development', icon: '◫', link: '/student/phases' },
    { title: 'Team Members', value: '4', description: 'Active members', icon: '👥', link: '/student/team' },
    { title: 'Pending Reviews', value: '1', description: 'Waiting for teacher', icon: '◷', link: '/student/tasks' }
  ];

  timeline: TimelineItem[] = DEMO_TIMELINE;
  recentUpdates: ActivityItem[] = DEMO_ACTIVITY;
  teacherRemarks: RemarkItem[] = DEMO_REMARKS;
  teamMembers: TeamMemberItem[] = DEMO_TEAM;

  constructor(
    private authService: AuthService,
    private studentPortalService: StudentPortalService,
    private taskService: TaskService,
    private phaseService: PhaseService
  ) {}

  ngOnInit(): void {

    this.studentName = this.authService.getUser()?.name || '';

    this.studentPortalService.getMyProject().subscribe({
      next: (p) => {

        if (!p) {
          // No real project yet - keep the demo project so the dashboard never looks empty
          this.isUsingDemoProject = true;
          return;
        }

        this.isUsingDemoProject = false;

        this.project = {
          title: p.title,
          type: p.team.length > 1 ? 'Team Project' : 'Individual',
          guide: p.guideName,
          progress: p.progress,
          currentPhase: p.status,
          teamMembers: p.team.length,
          pendingReviews: 0
        };

        this.stats[0].value = `${p.progress}%`;
        this.stats[1].value = p.status;
        this.stats[2].value = String(p.team.length);

        // Real team members (role/work from the project's teamMembers, not a top-level "student" field)
        if (p.team.length > 0) {
          this.teamMembers = p.team.map(m => ({
            name: m.name,
            role: m.role || 'Team Member',
            work: m.work ? m.work : `${p.progress}%`,
            initial: m.name.charAt(0).toUpperCase()
          }));
        }
      },
      error: (err) => console.error('Failed to load project summary:', err)
    });

    // Real department-scoped phases -> Project Timeline card
    this.phaseService.getPhases().subscribe({
      next: (phases) => {
        if (phases.length === 0) return;

        this.timeline = phases
          .sort((a, b) => a.phaseNumber - b.phaseNumber)
          .map(p => ({
            title: `Phase ${p.phaseNumber} – ${p.phaseName}`,
            date: `${this.formatDate(p.startDate)} – ${this.formatDate(p.endDate)}`,
            status: p.status === 'Completed' ? 'completed' : p.status === 'Active' ? 'current' : 'upcoming'
          }));
      },
      error: (err) => console.error('Failed to load phases:', err)
    });

    // Real tasks -> Recent Activity, Teacher Remarks, Pending Reviews count
    this.taskService.getMyTasks().subscribe({
      next: (tasks) => {
        if (tasks.length === 0) return;

        const sorted = [...tasks].sort(
          (a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
        );

        this.recentUpdates = sorted.slice(0, 4).map(t => ({
          task: t.title,
          description: t.status === 'Completed'
            ? `Teacher approved "${t.title}"`
            : t.status === 'Under Review'
              ? `"${t.title}" is waiting for review`
              : `You updated "${t.title}"`,
          date: this.formatRelative(t.updatedAt),
          status: t.status === 'Completed' ? 'Approved' : t.status === 'Under Review' ? 'Pending Review' : t.status
        }));

        const remarks = sorted.filter(t => !!t.teacherRemark);
        if (remarks.length > 0) {
          this.teacherRemarks = remarks.slice(0, 4).map(t => ({
            teacher: t.guideName || 'Guide',
            remark: t.teacherRemark,
            date: this.formatRelative(t.reviewedAt || t.updatedAt)
          }));
        }

        const pendingCount = tasks.filter(t => t.status === 'Under Review').length;
        this.project.pendingReviews = pendingCount;
        this.stats[3].value = String(pendingCount);
      },
      error: (err) => console.error('Failed to load tasks:', err)
    });

  }

  private formatDate(value: string): string {
    if (!value) return '-';
    const date = new Date(value);
    if (isNaN(date.getTime())) return '-';
    return date.toLocaleDateString('en-US', { month: 'short', day: '2-digit' });
  }

  private formatRelative(value: string): string {
    if (!value) return '-';
    const date = new Date(value);
    if (isNaN(date.getTime())) return '-';

    const diffMs = Date.now() - date.getTime();
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));

    if (diffHours < 1) return 'Just now';
    if (diffHours < 24) return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`;

    const diffDays = Math.floor(diffHours / 24);
    if (diffDays === 1) return 'Yesterday';
    return `${diffDays} days ago`;
  }

}
