import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment.development';
import { HttpClient } from '@angular/common/http';
import { AuthService } from '../auth/service/auth.service';
import { SupervisorInputSelect } from '../../../domain/response/Mecanico.model';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class MecanicoService {

  private apiUrl = `${environment.domain}${environment.apiEndpoint}${environment.mecanico}`;

  constructor(private http: HttpClient, private auth: AuthService) { }

  getSupervisores(): Observable<SupervisorInputSelect[]> {
    const headers = this.auth.getAuthHeaders();
    return this.http.get<SupervisorInputSelect[]>(`${this.apiUrl}/GetSupervisores`, { headers });
  }
}
