import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { environment } from '../../environments/environment';

// Shape returned directly by the backend (MongoDB document)
export interface StudentApiModel {
  _id: string;
  name: string;
  registerNumber: string;
  email: string;
  password: string;
  phone: string;
  department: string;
  year: string;
  status: string;
  guide: { _id: string; name: string; employeeId?: string; department?: string } | string | null;
  guideName: string;
  project?: string;
  createdAt?: string;
  updatedAt?: string;
}

// Shape used across the existing Angular templates/components (unchanged field names)
export interface Student {
  id: string;
  name: string;
  registerNumber: string;
  email: string;
  password: string;
  phone: string;
  department: string;
  year: string;
  status: string;
  guide: string;      // display name, e.g. "Dr. Kumar" or "Not Assigned"
  guideId: string;    // MongoDB ObjectId of the assigned teacher (empty string if none)
  project?: string;
}

interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}

function toStudent(api: StudentApiModel): Student {
  const guideObj = api.guide && typeof api.guide === 'object' ? api.guide : null;

  return {
    id: api._id,
    name: api.name,
    registerNumber: api.registerNumber,
    email: api.email,
    password: api.password,
    phone: api.phone,
    department: api.department,
    year: api.year,
    status: api.status,
    guide: guideObj?.name || api.guideName || 'Not Assigned',
    guideId: guideObj?._id || (typeof api.guide === 'string' ? api.guide : '') || '',
    project: api.project || 'Not Assigned'
  };
}

@Injectable({
  providedIn: 'root'
})
export class StudentService {

  private apiUrl = `${environment.apiUrl}/students`;

  constructor(private http: HttpClient) {}

  getStudents(): Observable<Student[]> {
    return this.http
      .get<ApiResponse<StudentApiModel[]>>(this.apiUrl)
      .pipe(map(res => res.data.map(toStudent)));
  }

  getStudentById(id: string): Observable<Student> {
    return this.http
      .get<ApiResponse<StudentApiModel>>(`${this.apiUrl}/${id}`)
      .pipe(map(res => toStudent(res.data)));
  }

  addStudent(student: Partial<Student>): Observable<Student> {
    const payload = {
      name: student.name,
      registerNumber: student.registerNumber,
      email: student.email,
      password: student.password,
      phone: student.phone,
      department: student.department,
      year: student.year,
      status: student.status,
      project: student.project
    };

    return this.http
      .post<ApiResponse<StudentApiModel>>(this.apiUrl, payload)
      .pipe(map(res => toStudent(res.data)));
  }

  updateStudent(id: string, student: Partial<Student>): Observable<Student> {
    return this.http
      .put<ApiResponse<StudentApiModel>>(`${this.apiUrl}/${id}`, student)
      .pipe(map(res => toStudent(res.data)));
  }

  deleteStudent(id: string): Observable<void> {
    return this.http
      .delete<ApiResponse<StudentApiModel>>(`${this.apiUrl}/${id}`)
      .pipe(map(() => undefined));
  }

  assignGuide(studentId: string, teacherId: string): Observable<Student> {
    return this.http
      .put<ApiResponse<StudentApiModel>>(`${this.apiUrl}/${studentId}/assign-guide`, { teacherId })
      .pipe(map(res => toStudent(res.data)));
  }

  removeGuide(studentId: string): Observable<Student> {
    return this.http
      .put<ApiResponse<StudentApiModel>>(`${this.apiUrl}/${studentId}/remove-guide`, {})
      .pipe(map(res => toStudent(res.data)));
  }
}
