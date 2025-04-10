import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment.development';
import { jwtDecode, JwtPayload } from "jwt-decode";

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
  
  getToken(): string {
    const token = localStorage.getItem('authToken');
    return token || "NotFoundToken";
  }

  getAuthHeaders(): HttpHeaders {
    const token = this.getToken();  
    return new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
      'Accept': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
    });
  }

  getDecodedToken(): JwtPayload | null {
    const token = this.getToken();
    if (!token) return null;

    try {
      return jwtDecode<JwtPayload>(token);
    } catch (error) {
      console.error('Error al decodificar el token', error);
      return null;
    }
  }

  getUserCode(): string | undefined {
    const token = this.getToken();
    if (!token) return undefined;
  
    try {
      const decoded: any = jwtDecode(token);
      return decoded.codigo || null;
    } catch (error) {
      console.error('Error al decodificar el token:', error);
      return undefined;
    }
  }
}
