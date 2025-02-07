import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { AuthService } from '../auth/service/auth.service';
import { environment } from '../../../environments/environment.development';
import { ordenTrabajoListResponse } from '../../../domain/response/OrdenTrabajo.model';

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


}
