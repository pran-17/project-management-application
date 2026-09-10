import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { environment } from '../../environments/environment';
import { Teacher, TeacherApiModel } from './teacher.service';
import { Student, StudentApiModel } from './student.service';

export interface MyProjectApiModel {
  _id: string;
  projectId: string;
  projectTitle: string;
  description: string;
  department: string;
  guide: { _id: string; name: string } | string | null;
  guideName: string;
  students: { _id: string; name: string; registerNumber?: string; department?: string; email?: string }[];
  teamMembers?: { student: { _id: string; name: string; registerNumber?: string } | string; registerNumber: string; role: string; work: string }[];
  status: string;
  progress: number;
  startDate?: string;
  endDate?: string;
}

export interface MyProject {
  id: string;
  projectId: string;
  title: string;
  description: string;
  department: string;
  status: string;
  progress: number;
  students: { id: string; name: string; registerNumber: string; department: string; email: string; role: string; work: string }[];
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

function toMyProject(api: MyProjectApiModel): MyProject {
  const roleMap = new Map<string, { role: string; work: string }>();
  (api.teamMembers || []).forEach(tm => {
    const sId = tm.student && typeof tm.student === 'object' ? tm.student._id : (typeof tm.student === 'string' ? tm.student : '');
    if (sId) {
      roleMap.set(sId, { role: tm.role || 'Team Member', work: tm.work || '' });
    }
  });

  return {
    id: api._id,
    projectId: api.projectId,
    title: api.projectTitle,
    description: api.description,
    department: api.department,
    status: api.status,
    progress: api.progress || 0,
    students: (api.students || []).map(s => ({
      id: s._id,
      name: s.name,
      registerNumber: s.registerNumber || '',
      department: s.department || '',
      email: s.email || '',
      role: roleMap.get(s._id)?.role || 'Team Member',
      work: roleMap.get(s._id)?.work || ''
    }))
  };
}

@Injectable({
  providedIn: 'root'
})
export class TeacherPortalService {

  private apiUrl = `${environment.apiUrl}/teachers`;

  constructor(private http: HttpClient) {}

  // GET /api/teachers/me/profile
  getMyProfile(): Observable<Teacher> {
    return this.http
      .get<ApiResponse<TeacherApiModel>>(`${this.apiUrl}/me/profile`)
      .pipe(map(res => toTeacher(res.data)));
  }

  // PUT /api/teachers/me/profile
  updateMyProfile(updates: { phone?: string; designation?: string; specialization?: string }): Observable<Teacher> {
    return this.http
      .put<ApiResponse<TeacherApiModel>>(`${this.apiUrl}/me/profile`, updates)
      .pipe(map(res => toTeacher(res.data)));
  }

  // GET /api/teachers/me/students -> all students this teacher is guiding
  getMyStudents(): Observable<Student[]> {
    return this.http
      .get<ApiResponse<StudentApiModel[]>>(`${this.apiUrl}/me/students`)
      .pipe(map(res => res.data.map(toStudent)));
  }

  // GET /api/teachers/me/projects -> all projects this teacher is guiding
  getMyProjects(): Observable<MyProject[]> {
    return this.http
      .get<ApiResponse<MyProjectApiModel[]>>(`${this.apiUrl}/me/projects`)
      .pipe(map(res => res.data.map(toMyProject)));
  }
}
