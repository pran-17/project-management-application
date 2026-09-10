import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { environment } from '../../environments/environment';

export interface ResearchPersonRef {
  _id: string;
  name: string;
  employeeId?: string;
  registerNumber?: string;
  department?: string;
  email?: string;
}

export interface ResearchProjectApiModel {
  _id: string;
  researchId: string;
  title: string;
  description: string;
  researchArea: string;
  department: string;
  principalInvestigator: ResearchPersonRef | string;
  teachers: (ResearchPersonRef | string)[];
  students: (ResearchPersonRef | string)[];
  fundingAgency: string;
  budget: number;
  startDate?: string;
  endDate?: string;
  status: string;
  progress: number;
  createdAt?: string;
  updatedAt?: string;
}

export interface ResearchPerson {
  id: string;
  name: string;
  identifier: string; // employeeId (teacher) or registerNumber (student)
  department: string;
}

// Shape used across admin/teacher/student research pages (keeps existing template field names)
export interface ResearchProject {
  id: string;          // MongoDB _id
  researchId: string;
  title: string;
  description: string;
  researchArea: string;
  department: string;
  principalInvestigator: ResearchPerson | null;
  teachers: ResearchPerson[];
  students: ResearchPerson[];
  fundingAgency: string;
  budget: number;
  startDate: string;
  endDate: string;
  status: string;
  progress: number;

  // Backward-compatible aliases used by existing template bindings
  duration: string;
  team: { id: string; name: string; registerNumber: string; email: string; role: string }[];
}

export interface CreateResearchProjectPayload {
  researchId: string;
  title: string;
  description?: string;
  researchArea?: string;
  department: string;
  principalInvestigator: string; // Teacher _id
  teachers?: string[];           // Teacher _ids
  students?: string[];           // Student _ids
  fundingAgency?: string;
  budget?: number;
  startDate?: string;
  endDate?: string;
  status?: string;
}

interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}

function toPerson(ref: ResearchPersonRef | string | undefined, kind: 'teacher' | 'student'): ResearchPerson | null {
  if (!ref) return null;
  if (typeof ref === 'string') {
    return { id: ref, name: 'Unknown', identifier: '', department: '' };
  }
  return {
    id: ref._id,
    name: ref.name,
    identifier: kind === 'teacher' ? (ref.employeeId || '') : (ref.registerNumber || ''),
    department: ref.department || ''
  };
}

function formatDate(d?: string): string {
  if (!d) return '-';
  const date = new Date(d);
  if (isNaN(date.getTime())) return '-';
  return date.toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });
}

function toResearchProject(api: ResearchProjectApiModel): ResearchProject {
  const pi = toPerson(api.principalInvestigator, 'teacher');
  const teachers = (api.teachers || []).map(t => toPerson(t, 'teacher')).filter((t): t is ResearchPerson => !!t);
  const students = (api.students || []).map(s => toPerson(s, 'student')).filter((s): s is ResearchPerson => !!s);

  return {
    id: api._id,
    researchId: api.researchId,
    title: api.title,
    description: api.description || '',
    researchArea: api.researchArea || '',
    department: api.department,
    principalInvestigator: pi,
    teachers,
    students,
    fundingAgency: api.fundingAgency || '',
    budget: api.budget || 0,
    startDate: formatDate(api.startDate),
    endDate: formatDate(api.endDate),
    status: api.status,
    progress: api.progress || 0,
    duration: api.startDate && api.endDate ? `${formatDate(api.startDate)} - ${formatDate(api.endDate)}` : '-',
    team: students.map(s => ({ id: s.id, name: s.name, registerNumber: s.identifier, email: '', role: 'Research Student' }))
  };
}

@Injectable({
  providedIn: 'root'
})
export class ResearchService {

  private apiUrl = `${environment.apiUrl}/research`;

  constructor(private http: HttpClient) {}

  getProjects(): Observable<ResearchProject[]> {
    return this.http
      .get<ApiResponse<ResearchProjectApiModel[]>>(this.apiUrl)
      .pipe(map(res => res.data.map(toResearchProject)));
  }

  getProjectById(id: string): Observable<ResearchProject> {
    return this.http
      .get<ApiResponse<ResearchProjectApiModel>>(`${this.apiUrl}/${id}`)
      .pipe(map(res => toResearchProject(res.data)));
  }

  addProject(payload: CreateResearchProjectPayload): Observable<ResearchProject> {
    return this.http
      .post<ApiResponse<ResearchProjectApiModel>>(this.apiUrl, payload)
      .pipe(map(res => toResearchProject(res.data)));
  }

  updateProject(id: string, payload: Partial<CreateResearchProjectPayload & { progress: number }>): Observable<ResearchProject> {
    return this.http
      .put<ApiResponse<ResearchProjectApiModel>>(`${this.apiUrl}/${id}`, payload)
      .pipe(map(res => toResearchProject(res.data)));
  }

  deleteProject(id: string): Observable<void> {
    return this.http
      .delete<ApiResponse<ResearchProjectApiModel>>(`${this.apiUrl}/${id}`)
      .pipe(map(() => undefined));
  }
}
