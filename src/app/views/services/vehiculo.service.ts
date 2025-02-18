import { Injectable } from '@angular/core';
import { AuthService } from '../auth/service/auth.service';
import { environment } from '../../../environments/environment.development';
import { Observable } from 'rxjs';
import { VehiculosList } from '../../../domain/response/Vehiculo.model';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class VehiculoService {

  private apiUrl = `${environment.domain}${environment.apiEndpoint}${environment.vehiculo}`;

  constructor(private auth: AuthService, private http: HttpClient) { }

  getVehiculosInstitucionales():Observable<VehiculosList[]> {
    const headers = this.auth.getAuthHeaders();
    return this.http.get<VehiculosList[]>(`${this.apiUrl}/ObtenerVehiculos`, { headers });
  }
}
