import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment.development';
import { HttpClient } from '@angular/common/http';
import { AuthService } from '../auth/service/auth.service';
import { ManoDeObra, SupervisorInputSelect } from '../../../domain/response/Mecanico.model';
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

  getManoObraOT(code: string): Observable<ManoDeObra[]>{
    const headers = this.auth.getAuthHeaders();
    return this.http.get<ManoDeObra[]>(`${environment.domain}${environment.apiEndpoint}${environment.ordenesTrabajo}/ObtenerManoDeObra/${code}`,{ headers })
  }
  getMecanicos(): Observable<any[]> {
    const headers = this.auth.getAuthHeaders();
    return this.http.get<any[]>(`${this.apiUrl}/GetMecanicos`, { headers });
  }
}
