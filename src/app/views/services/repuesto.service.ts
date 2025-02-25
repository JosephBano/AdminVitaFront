import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment.development';
import { HttpClient } from '@angular/common/http';
import { AuthService } from '../auth/service/auth.service';
import { Observable } from 'rxjs';
import { RepuestosDetalle } from '../../../domain/response/Repuestos.model';

@Injectable({
  providedIn: 'root'
})
export class RepuestoService {

  private apiURL = `${environment.domain}${environment.apiEndpoint}${environment.items}`;

  constructor(private http: HttpClient, private auth:AuthService) { }

  getRepuestosInsumosByOT(code: string): Observable<RepuestosDetalle[]>{
    const headers = this.auth.getAuthHeaders();
    return this.http.get<RepuestosDetalle[]>(`${this.apiURL}/GerItemsByOT/${code}`, { headers });
  }
}
