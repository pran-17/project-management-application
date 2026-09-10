import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { environment } from '../../environments/environment';

export interface TeacherApiModel {
  _id: string;
  name: string;
  employeeId: string;
  email: string;
  password: string;
  phone: string;
  department: string;
  designation: string;
  specialization: string;
  status: string;
  students: number;
  projects: number;
  createdAt?: string;
  updatedAt?: string;
}

// Shape used across the existing Angular templates/components (unchanged field names)
export interface Teacher {
  id: string;
  name: string;
  employeeId: string;
  password: string;
  email: string;
  phone: string;
  department: string;
  designation: string;
  specialization: string;
  students: number;
  projects: number;
  status: string;
}

interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}

function toTeacher(api: TeacherApiModel): Teacher {
  return {
    id: api._id,
    name: api.name,
    employeeId: api.employeeId,
    email: api.email,
    password: api.password,
    phone: api.phone,
    department: api.department,
    designation: api.designation,
    specialization: api.specialization,
    students: api.students || 0,
    projects: api.projects || 0,
    status: api.status
  };
}

@Injectable({
  providedIn: 'root'
})
export class TeacherService {

  private apiUrl = `${environment.apiUrl}/teachers`;

  constructor(private http: HttpClient) {}

  getTeachers(): Observable<Teacher[]> {
    return this.http
      .get<ApiResponse<TeacherApiModel[]>>(this.apiUrl)
      .pipe(map(res => res.data.map(toTeacher)));
  }

  getTeacherById(id: string): Observable<Teacher> {
    return this.http
      .get<ApiResponse<TeacherApiModel>>(`${this.apiUrl}/${id}`)
      .pipe(map(res => toTeacher(res.data)));
  }

  addTeacher(teacher: Partial<Teacher>): Observable<Teacher> {
    const payload = {
      name: teacher.name,
      employeeId: teacher.employeeId,
      email: teacher.email,
      password: teacher.password,
      phone: teacher.phone,
      department: teacher.department,
      designation: teacher.designation,
      specialization: teacher.specialization,
      status: teacher.status || 'Active'
    };

    return this.http
      .post<ApiResponse<TeacherApiModel>>(this.apiUrl, payload)
      .pipe(map(res => toTeacher(res.data)));
  }

  updateTeacher(id: string, teacher: Partial<Teacher>): Observable<Teacher> {
    return this.http
      .put<ApiResponse<TeacherApiModel>>(`${this.apiUrl}/${id}`, teacher)
      .pipe(map(res => toTeacher(res.data)));
  }

  deleteTeacher(id: string): Observable<void> {
    return this.http
      .delete<ApiResponse<TeacherApiModel>>(`${this.apiUrl}/${id}`)
      .pipe(map(() => undefined));
  }

  toggleStatus(id: string): Observable<Teacher> {
    return this.http
      .put<ApiResponse<TeacherApiModel>>(`${this.apiUrl}/${id}/toggle-status`, {})
      .pipe(map(res => toTeacher(res.data)));
  }
}
