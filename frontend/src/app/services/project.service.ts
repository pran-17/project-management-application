import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { environment } from '../../environments/environment';

export interface ProjectApiModel {
  _id: string;
  projectId: string;
  projectTitle: string;
  description: string;
  department: string;
  guide: { _id: string; name: string } | string | null;
  guideName: string;
  students: { _id: string; name: string; registerNumber?: string }[] | string[];
  type?: 'Individual' | 'Team';
  status: string;
  progress: number;
  startDate?: string;
  endDate?: string;
  createdAt?: string;
  updatedAt?: string;
}

// Shape used in admin/projects.ts (keeps existing template field names: id, title, guide, students[])
export interface Project {
  id: string;         // human-readable project code, e.g. PRJ001 (maps to backend projectId)
  dbId: string;        // MongoDB _id, used for update/delete calls
  title: string;
  department: string;
  guide: string;        // guide display name
  guideId: string;      // teacher MongoDB _id, if linked
  students: string[];   // student display names
  type: 'Individual' | 'Team';
  status: string;
  progress: number;
}

interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}

function toProject(api: ProjectApiModel): Project {
  const guideObj = api.guide && typeof api.guide === 'object' ? api.guide : null;

  const studentNames = (api.students || []).map((s: any) =>
    typeof s === 'string' ? s : s?.name || 'Unknown'
  );

  return {
    id: api.projectId,
    dbId: api._id,
    title: api.projectTitle,
    department: api.department,
    guide: guideObj?.name || api.guideName || 'Not Assigned',
    guideId: guideObj?._id || (typeof api.guide === 'string' ? api.guide : '') || '',
    students: studentNames,
    type: api.type || (studentNames.length > 1 ? 'Team' : 'Individual'),
    status: api.status,
    progress: api.progress || 0
  };
}

@Injectable({
  providedIn: 'root'
})
export class ProjectService {

  private apiUrl = `${environment.apiUrl}/projects`;

  constructor(private http: HttpClient) {}

  getProjects(): Observable<Project[]> {
    return this.http
      .get<ApiResponse<ProjectApiModel[]>>(this.apiUrl)
      .pipe(map(res => res.data.map(toProject)));
  }

  getProjectById(id: string): Observable<Project> {
    return this.http
      .get<ApiResponse<ProjectApiModel>>(`${this.apiUrl}/${id}`)
      .pipe(map(res => toProject(res.data)));
  }

  addProject(payload: {
    projectId: string;
    projectTitle: string;
    department: string;
    guideName?: string;
    status?: string;
  }): Observable<Project> {
    return this.http
      .post<ApiResponse<ProjectApiModel>>(this.apiUrl, payload)
      .pipe(map(res => toProject(res.data)));
  }

  updateProject(dbId: string, project: Partial<any>): Observable<Project> {
    return this.http
      .put<ApiResponse<ProjectApiModel>>(`${this.apiUrl}/${dbId}`, project)
      .pipe(map(res => toProject(res.data)));
  }

  deleteProject(dbId: string): Observable<void> {
    return this.http
      .delete<ApiResponse<ProjectApiModel>>(`${this.apiUrl}/${dbId}`)
      .pipe(map(() => undefined));
  }
}
