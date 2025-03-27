import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment.development';
import { AuthService } from '../auth/service/auth.service';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ClienteValidadoXDoc, VehiculoValidadoXPlaca } from '../../../domain/response/Validacion.model';
import { PersonaValidadaXDoc } from '../../../domain/response/Persona.model';

@Injectable({
  providedIn: 'root'
})
export class ValidacionService {

   private apiUrl = `${environment.domain}${environment.apiEndpoint}${environment.validacion}`;
  
    constructor(private http: HttpClient, private auth: AuthService) { }
  
    validarClienteXDoc(documento: string): Observable<ClienteValidadoXDoc> {
      const headers = this.auth.getAuthHeaders();
      return this.http.get<ClienteValidadoXDoc>(`${this.apiUrl}/ValidarCliente/${documento}`, { headers });
    }
    validarProveedorXDoc(documento: string): Observable<any> {
      const headers = this.auth.getAuthHeaders();
      return this.http.post<any>(`${this.apiUrl}/ValidarProveedor`, { documento }, { headers });
    }
    validarVehiculoXPlaca(placa: string): Observable<VehiculoValidadoXPlaca> {
      const headers = this.auth.getAuthHeaders();
      return this.http.get<VehiculoValidadoXPlaca>(`${this.apiUrl}/ValidarVehiculo/${placa}`, { headers });
    }
    validarPersonaXDoc(documento: string): Observable<PersonaValidadaXDoc> {
      const headers = this.auth.getAuthHeaders();
      return this.http.post<PersonaValidadaXDoc>(`${this.apiUrl}/ValidarPersona`, { documento }, { headers });
    }
}
