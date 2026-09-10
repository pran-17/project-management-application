import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface ChatResponse {
  success: boolean;
  message: string;
}

@Injectable({
  providedIn: 'root'
})
export class AiChatService {

  private apiUrl = 'http://localhost:5000/api/chat';

  constructor(private http: HttpClient) {}

  sendMessage(message: string): Observable<ChatResponse> {

    const token = sessionStorage.getItem('token');

    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`
    });

    return this.http.post<ChatResponse>(
      this.apiUrl,
      { message },
      { headers }
    );
  }
}