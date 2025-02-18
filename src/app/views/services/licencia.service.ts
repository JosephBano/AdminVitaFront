import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment.development';
import { AuthService } from '../auth/service/auth.service';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { LicenciaList } from '../../../domain/response/Licencia.model';

@Injectable({
  providedIn: 'root'
})
export class LicenciaService {

  private apiUrl = `${environment.domain}${environment.apiEndpoint}${environment.licencia}`;

  constructor(private auth: AuthService, private http: HttpClient) { }

  getLicencias(): Observable<LicenciaList[]> {
    const headers = this.auth.getAuthHeaders();
    return this.http.get<LicenciaList[]>(`${this.apiUrl}/GetLicencias`, { headers });
  }
}
