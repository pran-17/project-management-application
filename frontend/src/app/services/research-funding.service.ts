import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { environment } from '../../environments/environment';

export interface ResearchFundingApiModel {
  _id: string;
  fundingId: string;
  projectTitle: string;
  fundingAgency: string;
  fundingProviderName: string;
  principalInvestigator: string;
  department: string;
  startDate: string;
  endDate: string;
  totalAmount: number;
  utilizedAmount: number;
  remainingAmount: number;
  status: string;
  createdAt?: string;
  updatedAt?: string;
}

// Shape used across the existing Angular templates/components (unchanged field names)
export interface ResearchFunding {
  id: string;
  fundingId: string;
  projectTitle: string;
  fundingAgency: string;
  fundingProviderName?: string;
  principalInvestigator: string;
  department: string;
  startDate: string;
  endDate: string;
  totalAmount: number;
  utilizedAmount: number;
  remainingAmount: number;
  status: string;
}

interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}

function toFunding(api: ResearchFundingApiModel): ResearchFunding {
  return {
    id: api._id,
    fundingId: api.fundingId,
    projectTitle: api.projectTitle,
    fundingAgency: api.fundingAgency,
    fundingProviderName: api.fundingProviderName,
    principalInvestigator: api.principalInvestigator,
    department: api.department,
    startDate: api.startDate,
    endDate: api.endDate,
    totalAmount: api.totalAmount,
    utilizedAmount: api.utilizedAmount,
    remainingAmount: api.remainingAmount,
    status: api.status
  };
}

@Injectable({
  providedIn: 'root'
})
export class ResearchFundingService {

  private apiUrl = `${environment.apiUrl}/funding`;

  constructor(private http: HttpClient) {}

  getFunding(): Observable<ResearchFunding[]> {
    return this.http
      .get<ApiResponse<ResearchFundingApiModel[]>>(this.apiUrl)
      .pipe(map(res => res.data.map(toFunding)));
  }

  getFundingById(id: string): Observable<ResearchFunding> {
    return this.http
      .get<ApiResponse<ResearchFundingApiModel>>(`${this.apiUrl}/${id}`)
      .pipe(map(res => toFunding(res.data)));
  }

  addFunding(funding: Partial<ResearchFunding>): Observable<ResearchFunding> {
    return this.http
      .post<ApiResponse<ResearchFundingApiModel>>(this.apiUrl, funding)
      .pipe(map(res => toFunding(res.data)));
  }

  updateFunding(id: string, funding: Partial<ResearchFunding>): Observable<ResearchFunding> {
    return this.http
      .put<ApiResponse<ResearchFundingApiModel>>(`${this.apiUrl}/${id}`, funding)
      .pipe(map(res => toFunding(res.data)));
  }

  deleteFunding(id: string): Observable<void> {
    return this.http
      .delete<ApiResponse<ResearchFundingApiModel>>(`${this.apiUrl}/${id}`)
      .pipe(map(() => undefined));
  }
}
