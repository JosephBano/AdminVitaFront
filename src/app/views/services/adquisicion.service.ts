import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment.development';
import { HttpClient } from '@angular/common/http';
import { AuthService } from '../auth/service/auth.service';
import { Observable } from 'rxjs';
import { AdquisicionListResponse } from '../../../domain/response/Adquisicion.model';

@Injectable({
  providedIn: 'root'
})
export class AdquisicionService {

  private apiURL = `${environment.domain}${environment.apiEndpoint}${environment.adjuntos}`

  constructor(private http: HttpClient, private auth: AuthService) { }

  getAdquisicionList(): Observable<any> {
    const headers = this.auth.getAuthHeaders();
    return this.http.get<any>(`${this.apiURL}/GetListaCompras`, { headers });
  }
}
