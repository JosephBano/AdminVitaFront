import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment.development';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = `${environment.domain}${environment.apiEndpoint}${environment.authentication}`;

  constructor(private http: HttpClient) { }
  login(email: string, password: string): Observable<any> {
    const body = { email, password };
    const headers = new HttpHeaders({'Content-Type': 'application/json'});
    return this.http.post(this.apiUrl, body, { headers });
  }

  saveToken(token: string): void {
    localStorage.setItem('authToken', token);
  }

  deleteToken(): void {
    localStorage.removeItem('authToken');
  }
  
  getToken(): string | null {
    return localStorage.getItem('authToken');
  }

  getAuthHeaders(): HttpHeaders {
    const token = this.getToken();  
    return new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    });
  }

  getUserData(): Observable<any> {
    return this.http.get(this.apiUrl + '/user', { headers: this.getAuthHeaders() });
  }
}
