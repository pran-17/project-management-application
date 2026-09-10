import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { environment } from '../../environments/environment';

export type TaskStatus = 'Pending' | 'In Progress' | 'Under Review' | 'Completed';
export type TaskPriority = 'Low' | 'Medium' | 'High';

export interface TaskRef {
  _id: string;
  name?: string;
  registerNumber?: string;
  employeeId?: string;
  department?: string;
  email?: string;
  projectId?: string;
  projectTitle?: string;
  phaseNumber?: number;
  phaseName?: string;
  startDate?: string;
  endDate?: string;
  status?: string;
}

export interface TaskApiModel {
  _id: string;
  title: string;
  description: string;
  student: TaskRef | string;
  guide: TaskRef | string | null;
  project: TaskRef | string | null;
  phase: TaskRef | string;
  department: string;
  priority: TaskPriority;
  status: TaskStatus;
  progress: number;
  assignedDate?: string;
  dueDate?: string;
  studentWork?: string;
  studentRemark?: string;
  teacherRemark?: string;
  submittedAt?: string | null;
  reviewedAt?: string | null;
  createdAt?: string;
  updatedAt?: string;
}

export interface ProjectTask {
  id: string;
  title: string;
  description: string;
  studentId: string;
  studentName: string;
  registerNumber: string;
  guideId: string;
  guideName: string;
  projectId: string;
  projectTitle: string;
  phaseId: string;
  phaseLabel: string;
  department: string;
  priority: TaskPriority;
  status: TaskStatus;
  progress: number;
  assignedDate: string;
  dueDate: string;
  studentWork: string;
  studentRemark: string;
  teacherRemark: string;
  submittedAt: string;
  reviewedAt: string;
  updatedAt: string;
}

export interface CreateTaskPayload {
  title: string;
  description?: string;
  phase: string;
  priority?: TaskPriority;
  assignedDate?: string;
  dueDate?: string;
  studentWork?: string;
  progress?: number;
  status?: TaskStatus;
  studentRemark?: string;
}

export interface UpdateTaskPayload {
  title?: string;
  description?: string;
  phase?: string;
  priority?: TaskPriority;
  assignedDate?: string;
  dueDate?: string;
  studentWork?: string;
  progress?: number;
  status?: TaskStatus;
  studentRemark?: string;
}

export interface ReviewTaskPayload {
  teacherRemark?: string;
  status?: TaskStatus;
  progress?: number;
}

export interface TaskFilters {
  department?: string;
  status?: string;
  priority?: string;
  student?: string;
  guide?: string;
  project?: string;
  phase?: string;
}

interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}

function refId(ref: TaskRef | string | null | undefined): string {
  if (!ref) return '';
  if (typeof ref === 'string') return ref;
  return ref._id || '';
}

export function toProjectTask(api: TaskApiModel): ProjectTask {
  const student = typeof api.student === 'object' ? api.student : null;
  const guide = typeof api.guide === 'object' ? api.guide : null;
  const project = typeof api.project === 'object' ? api.project : null;
  const phase = typeof api.phase === 'object' ? api.phase : null;

  const phaseLabel = phase
    ? `Phase ${phase.phaseNumber} - ${phase.phaseName}`
    : 'Not Assigned';

  return {
    id: api._id,
    title: api.title,
    description: api.description || '',
    studentId: refId(api.student),
    studentName: student?.name || '',
    registerNumber: student?.registerNumber || '',
    guideId: refId(api.guide),
    guideName: guide?.name || '',
    projectId: refId(api.project),
    projectTitle: project?.projectTitle || 'Not Assigned',
    phaseId: refId(api.phase),
    phaseLabel,
    department: api.department,
    priority: api.priority,
    status: api.status,
    progress: api.progress || 0,
    assignedDate: api.assignedDate || '',
    dueDate: api.dueDate || '',
    studentWork: api.studentWork || '',
    studentRemark: api.studentRemark || '',
    teacherRemark: api.teacherRemark || '',
    submittedAt: api.submittedAt || '',
    reviewedAt: api.reviewedAt || '',
    updatedAt: api.updatedAt || ''
  };
}

function withFilters(url: string, filters?: TaskFilters) {
  let params = new HttpParams();
  if (filters) {
    Object.entries(filters).forEach(([key, value]) => {
      if (value) params = params.set(key, value);
    });
  }
  return { url, params };
}

@Injectable({
  providedIn: 'root'
})
export class TaskService {

  private apiUrl = `${environment.apiUrl}/tasks`;

  constructor(private http: HttpClient) {}

  createTask(payload: CreateTaskPayload): Observable<ProjectTask> {
    return this.http
      .post<ApiResponse<TaskApiModel>>(this.apiUrl, payload)
      .pipe(map(res => toProjectTask(res.data)));
  }

  getMyTasks(filters?: TaskFilters): Observable<ProjectTask[]> {
    const { params } = withFilters(`${this.apiUrl}/me`, filters);
    return this.http
      .get<ApiResponse<TaskApiModel[]>>(`${this.apiUrl}/me`, { params })
      .pipe(map(res => (res.data || []).map(toProjectTask)));
  }

  getTeacherTasks(filters?: TaskFilters): Observable<ProjectTask[]> {
    const { params } = withFilters(`${this.apiUrl}/teacher`, filters);
    return this.http
      .get<ApiResponse<TaskApiModel[]>>(`${this.apiUrl}/teacher`, { params })
      .pipe(map(res => (res.data || []).map(toProjectTask)));
  }

  getTaskById(id: string): Observable<ProjectTask> {
    return this.http
      .get<ApiResponse<TaskApiModel>>(`${this.apiUrl}/${id}`)
      .pipe(map(res => toProjectTask(res.data)));
  }

  updateTask(id: string, payload: UpdateTaskPayload): Observable<ProjectTask> {
    return this.http
      .put<ApiResponse<TaskApiModel>>(`${this.apiUrl}/${id}`, payload)
      .pipe(map(res => toProjectTask(res.data)));
  }

  deleteTask(id: string): Observable<void> {
    return this.http
      .delete<ApiResponse<TaskApiModel>>(`${this.apiUrl}/${id}`)
      .pipe(map(() => undefined));
  }

  reviewTask(id: string, payload: ReviewTaskPayload): Observable<ProjectTask> {
    return this.http
      .put<ApiResponse<TaskApiModel>>(`${this.apiUrl}/${id}/review`, payload)
      .pipe(map(res => toProjectTask(res.data)));
  }
}
