import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { environment } from '../../environments/environment';

export interface PhaseApiModel {
  _id: string;
  phaseNumber: number;
  phaseName: string;
  description: string;
  department: string;
  startDate: string;
  endDate: string;
  status: 'Active' | 'Inactive' | 'Completed' | 'Upcoming';
  createdBy?: { _id: string; name?: string; email?: string; role?: string } | string | null;
  taskCount?: number;
  completedTasks?: number;
  inProgressTasks?: number;
  pendingTasks?: number;
  underReviewTasks?: number;
  progress?: number;
  tasks?: unknown[];
  createdAt?: string;
  updatedAt?: string;
}

export interface ProjectPhase {
  id: string;
  phaseNumber: number;
  phaseName: string;
  description: string;
  department: string;
  startDate: string;
  endDate: string;
  status: 'Active' | 'Inactive' | 'Completed' | 'Upcoming';
  taskCount: number;
  completedTasks: number;
  inProgressTasks: number;
  pendingTasks: number;
  underReviewTasks: number;
  progress: number;
}

export interface PhasePayload {
  phaseNumber: number;
  phaseName: string;
  description?: string;
  department: string;
  startDate: string;
  endDate: string;
  status: 'Active' | 'Inactive' | 'Completed' | 'Upcoming';
}

interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}

export function toProjectPhase(api: PhaseApiModel): ProjectPhase {
  return {
    id: api._id,
    phaseNumber: api.phaseNumber,
    phaseName: api.phaseName,
    description: api.description || '',
    department: api.department,
    startDate: api.startDate,
    endDate: api.endDate,
    status: api.status,
    taskCount: api.taskCount || 0,
    completedTasks: api.completedTasks || 0,
    inProgressTasks: api.inProgressTasks || 0,
    pendingTasks: api.pendingTasks || 0,
    underReviewTasks: api.underReviewTasks || 0,
    progress: api.progress || 0
  };
}

@Injectable({
  providedIn: 'root'
})
export class PhaseService {

  private apiUrl = `${environment.apiUrl}/phases`;

  constructor(private http: HttpClient) {}

  getPhases(filters?: { department?: string; status?: string }): Observable<ProjectPhase[]> {
    let params = new HttpParams();
    if (filters?.department) params = params.set('department', filters.department);
    if (filters?.status) params = params.set('status', filters.status);

    return this.http
      .get<ApiResponse<PhaseApiModel[]>>(this.apiUrl, { params })
      .pipe(map(res => (res.data || []).map(toProjectPhase)));
  }

  getPhasesByDepartment(department: string): Observable<ProjectPhase[]> {
    return this.http
      .get<ApiResponse<PhaseApiModel[]>>(`${this.apiUrl}/department/${encodeURIComponent(department)}`)
      .pipe(map(res => (res.data || []).map(toProjectPhase)));
  }

  getPhaseById(id: string): Observable<PhaseApiModel> {
    return this.http
      .get<ApiResponse<PhaseApiModel>>(`${this.apiUrl}/${id}`)
      .pipe(map(res => res.data));
  }

  createPhase(payload: PhasePayload): Observable<ProjectPhase> {
    return this.http
      .post<ApiResponse<PhaseApiModel>>(this.apiUrl, payload)
      .pipe(map(res => toProjectPhase(res.data)));
  }

  updatePhase(id: string, payload: Partial<PhasePayload>): Observable<ProjectPhase> {
    return this.http
      .put<ApiResponse<PhaseApiModel>>(`${this.apiUrl}/${id}`, payload)
      .pipe(map(res => toProjectPhase(res.data)));
  }

  deletePhase(id: string): Observable<void> {
    return this.http
      .delete<ApiResponse<PhaseApiModel>>(`${this.apiUrl}/${id}`)
      .pipe(map(() => undefined));
  }
}
