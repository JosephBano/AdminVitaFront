import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { AuthService } from '../auth/service/auth.service';
import { environment } from '../../../environments/environment.development';
import { OrdenTrabajo, ordenTrabajoListResponse } from '../../../domain/response/OrdenTrabajoResponse.model';
import { ActualizarOrdenRequest } from '../../../domain/request/OrdenTrabajoRequest.model';

@Injectable({
  providedIn: 'root'
})
export class OrdenTrabajoService {

  private apiUrl = `${environment.domain}${environment.apiEndpoint}${environment.ordenesTrabajo}`;

  constructor(private http: HttpClient, private auth: AuthService) {
  }

  getOrdenesTrabajoListado(): Observable<ordenTrabajoListResponse> {
    const headers = this.auth.getAuthHeaders();
    return this.http.get<ordenTrabajoListResponse>(`${this.apiUrl}/GetOrdenes`, { headers });
  }

  getOrdenTrabajoCodigo(code: string): Observable<OrdenTrabajo> {
    const headers = this.auth.getAuthHeaders();
    return this.http.get<OrdenTrabajo>(`${this.apiUrl}/${code}`, { headers });
  }

  updateOrdenTrabajo(data: ActualizarOrdenRequest): Observable<any> {
    const headers = this.auth.getAuthHeaders();
    return this.http.put<any>(`${this.apiUrl}/ActualizarOrden`, data, { headers });
  }
  exportAllToExcel(): Observable<Blob> {
    const headers = this.auth.getAuthHeaders();
    return this.http.get(`${this.apiUrl}/ExportToExcel`, { headers, responseType: 'blob' });
  }
}
