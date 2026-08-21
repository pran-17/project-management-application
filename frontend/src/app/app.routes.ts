import { Routes } from '@angular/router';

export const routes: Routes = [

  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full'
  },

  {
    path: 'login',
    loadComponent: () =>
      import('./auth/login/login')
        .then(m => m.Login)
  },

  {
    path: 'student/dashboard',
    loadComponent: () =>
      import('./student/dashboard/dashboard')
        .then(m => m.Dashboard)
  },

  {
  path: 'student/project',
  loadComponent: () =>
    import('./student/project/project')
      .then(m => m.Project)
},
{
  path: 'student/team',
  loadComponent: () =>
    import('./student/team/team')
      .then(m => m.Team)
},
{
  path: 'student/tasks',
  loadComponent: () =>
    import('./student/tasks/tasks')
      .then(m => m.Tasks)
},


  {
  path: 'student/phases',
  loadComponent: () =>
    import('./student/phases/phases')
      .then(m => m.Phases)
},

{
  path: 'student/profile',
  loadComponent: () =>
    import('./student/profile/profile')
      .then(m => m.Profile)
},
 
{
  path: 'student/documents',

  loadComponent: () =>
    import('./student/documents/documents')
      .then(m => m.Documents)
},

{
  path: 'student/research',

  loadComponent: () =>
    import('./student/research/research')
      .then(m => m.Research)
},

  {
    path: 'admin/dashboard',
    loadComponent: () =>
      import('./admin/dashboard/dashboard')
        .then(m => m.Dashboard)
  },
  {
  path: 'teacher/dashboard',
  loadComponent: () =>
    import('./teacher/dashboard/dashboard')
      .then(m => m.Dashboard)
},

{
  path: 'teacher/students',
  loadComponent: () =>
    import('./teacher/students/students')
      .then(m => m.Students)
},

{
  path: 'teacher/student-details/:id',
  loadComponent: () =>
    import('./teacher/student-details/student-details')
      .then(m => m.StudentDetails)
},

{
  path: 'teacher/projects',
  loadComponent: () =>
    import('./teacher/projects/projects')
      .then(m => m.Projects)
},

{
  path: 'teacher/project-details/:id',
  loadComponent: () =>
    import('./teacher/project-details/project-details')
      .then(m => m.ProjectDetails)
},

{
  path: 'teacher/phases',
  loadComponent: () =>
    import('./teacher/phases/phases')
      .then(m => m.Phases)
},

{
  path: 'teacher/review',
  loadComponent: () =>
    import('./teacher/review/review')
      .then(m => m.Review)
},

{
  path: 'teacher/research/:id',
  loadComponent: () =>
    import('./teacher/research/research')
      .then(m => m.Research)
},
{
  path: 'teacher/research-details/:id',
  loadComponent: () =>
    import('./teacher/research-details/research-details')
      .then(m => m.ResearchDetails)
},
{
  path: 'teacher/research',
  loadComponent: () =>
    import('./teacher/research/research')
      .then(m => m.Research)
},

{
  path: 'teacher/funding',
  loadComponent: () =>
    import('./teacher/funding/funding')
      .then(m => m.Funding)
},
{
  path: 'admin/user-management',
  loadComponent: () =>
    import('./admin/user-management/user-management')
      .then(m => m.UserManagement)
},

{
  path: 'teacher/reports',
  loadComponent: () =>
    import('./teacher/reports/reports')
      .then(m => m.Reports)
},
{
  path: 'admin/dashboard',
  loadComponent: () =>
    import('./admin/dashboard/dashboard')
      .then(m => m.Dashboard)
},

{
  path: 'admin/students',
  loadComponent: () =>
    import('./admin/students/students')
      .then(m => m.Students)
},
{
  path: 'admin/assign-guide',
  loadComponent: () =>
    import('./admin/assign-guide/assign-guide')
      .then(m => m.AssignGuide)
},
{
  path: 'admin/projects',
  loadComponent: () =>
    import('./admin/projects/projects')
      .then(m => m.Projects)
},
{
  path: 'admin/teacher',
  loadComponent: () =>
    import('./admin/teacher/teacher')
      .then(m => m.Teachers)
},
{
  path: 'admin/phases',
  loadComponent: () =>
    import('./admin/phases/phases')
      .then(m => m.Phases)
},
  {
    path: '**',
    redirectTo: 'login'
  }

];