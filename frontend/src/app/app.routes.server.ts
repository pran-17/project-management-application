import { RenderMode, ServerRoute } from '@angular/ssr';

export const serverRoutes: ServerRoute[] = [

  {
    path: 'teacher/student-details/:id',
    renderMode: RenderMode.Client
  },

  {
    path: 'teacher/project-details/:id',
    renderMode: RenderMode.Client
  },

  {
    path: '**',
    renderMode: RenderMode.Prerender
  }

];