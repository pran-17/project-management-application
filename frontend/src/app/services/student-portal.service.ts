import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { environment } from '../../environments/environment';
import { Student, StudentApiModel } from './student.service';

export interface MyProjectTeamMemberApi {
  student: { _id: string; name: string; registerNumber?: string; department?: string; email?: string } | string;
  registerNumber: string;
  role: string;
  work: string;
}

export interface MyProjectApiModel {
  _id: string;
  projectId: string;
  projectTitle: string;
  description: string;
  department: string;
  guide: { _id: string; name: string; employeeId?: string; department?: string; email?: string; phone?: string } | string | null;
  guideName: string;
  students: { _id: string; name: string; registerNumber?: string; department?: string; email?: string }[];
  teamMembers?: MyProjectTeamMemberApi[];
  type?: 'Individual' | 'Team';
  status: string;
  progress: number;
  startDate?: string;
  endDate?: string;
}

export interface ProjectTeamMember {
  id: string;
  name: string;
  registerNumber: string;
  department: string;
  email: string;
  role: string;
  work: string;
}

export interface MyProject {
  id: string;
  projectId: string;
  title: string;
  description: string;
  department: string;
  status: string;
  progress: number;
  guideName: string;
  type: 'Individual' | 'Team';
  team: ProjectTeamMember[];
}

// Result of looking up a student by register number (GET /api/students/register/:registerNumber)
export interface StudentLookupResult {
  id: string;
  name: string;
  registerNumber: string;
  email: string;
  department: string;
  year: string;
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

function toMyProject(api: MyProjectApiModel): MyProject {
  const guideObj = api.guide && typeof api.guide === 'object' ? api.guide : null;

  return {
    id: api._id,
    projectId: api.projectId,
    title: api.projectTitle,
    description: api.description,
    department: api.department,
    status: api.status,
    progress: api.progress || 0,
    guideName: guideObj?.name || api.guideName || 'Not Assigned',
    type: api.type || (api.students && api.students.length > 1 ? 'Team' : 'Individual'),
    team: (api.teamMembers && api.teamMembers.length > 0
      ? api.teamMembers.map(tm => {
          const s = tm.student && typeof tm.student === 'object' ? tm.student : null;
          return {
            id: s?._id || (typeof tm.student === 'string' ? tm.student : ''),
            name: s?.name || 'Unknown',
            registerNumber: s?.registerNumber || tm.registerNumber || '',
            department: s?.department || '',
            email: s?.email || '',
            role: tm.role || 'Team Member',
            work: tm.work || ''
          };
        })
      : (api.students || []).map(s => ({
          id: s._id,
          name: s.name,
          registerNumber: s.registerNumber || '',
          department: s.department || '',
          email: s.email || '',
          role: 'Team Member',
          work: ''
        })))
  };
}

@Injectable({
  providedIn: 'root'
})
export class StudentPortalService {

  private apiUrl = `${environment.apiUrl}/students`;
  private projectsApiUrl = `${environment.apiUrl}/projects`;

  constructor(private http: HttpClient) {}

  // GET /api/students/me/profile
  getMyProfile(): Observable<Student> {
    return this.http
      .get<ApiResponse<StudentApiModel>>(`${this.apiUrl}/me/profile`)
      .pipe(map(res => toStudent(res.data)));
  }

  // PUT /api/students/me/profile
  updateMyProfile(updates: { phone?: string; year?: string; department?: string }): Observable<Student> {
    return this.http
      .put<ApiResponse<StudentApiModel>>(`${this.apiUrl}/me/profile`, updates)
      .pipe(map(res => toStudent(res.data)));
  }

  // GET /api/students/me/project -> the project this student is a team member of (or null)
  getMyProject(): Observable<MyProject | null> {
    return this.http
      .get<ApiResponse<MyProjectApiModel | null>>(`${this.apiUrl}/me/project`)
      .pipe(map(res => (res.data ? toMyProject(res.data) : null)));
  }

  // POST /api/projects/me -> student creates their own project (Individual or Team)
  createMyProject(payload: {
    projectTitle: string;
    description?: string;
    department: string;
    type: 'Individual' | 'Team';
    teamMembers?: { registerNumber: string; role: string; work: string }[];
  }): Observable<MyProject> {
    return this.http
      .post<ApiResponse<MyProjectApiModel>>(this.projectsApiUrl + '/me', payload)
      .pipe(map(res => toMyProject(res.data)));
  }

  // GET /api/students/register/:registerNumber -> look up a student to add as a team member
  lookupStudentByRegisterNumber(registerNumber: string): Observable<StudentLookupResult> {
    return this.http
      .get<ApiResponse<{ _id: string; name: string; registerNumber: string; email: string; department: string; year: string }>>(
        `${this.apiUrl}/register/${encodeURIComponent(registerNumber)}`
      )
      .pipe(map(res => ({
        id: res.data._id,
        name: res.data.name,
        registerNumber: res.data.registerNumber,
        email: res.data.email,
        department: res.data.department,
        year: res.data.year
      })));
  }
}
