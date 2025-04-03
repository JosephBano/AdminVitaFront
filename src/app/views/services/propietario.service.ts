import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment.development';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Cliente } from '../../../domain/request/Cliente.model';
import { toFormData } from '../shared/util/form-data.util';

@Injectable({
  providedIn: 'root'
})
export class PropietarioService {

  private apiUrl = `${environment.domain}${environment.apiEndpoint}${environment.propietario}`;

  constructor(private http:HttpClient) { }

  getPropietariosVehiculo(id:number): Observable<any>{
    return this.http.get<any>(`${this.apiUrl}/GetPropietariosVehiculo/${id}`);
  }

   registrarPropietario(cliente: Cliente): Observable<any> {
      const formData = toFormData(cliente);
      return this.http.post(`${this.apiUrl}/RegistrarPropietario`, formData);
    }
}
