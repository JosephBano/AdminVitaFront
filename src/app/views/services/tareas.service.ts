import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment.development';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ObservacionesOTDetalle, TareaDetalle, TrabajoExternoDetalle } from '../../../domain/response/Tarea.model';
import { AuthService } from '../auth/service/auth.service';

@Injectable({
  providedIn: 'root'
})
export class TareasService {

  private apiURL = `${environment.domain}${environment.apiEndpoint}${environment.tarea}`;

  constructor(private http: HttpClient, private auth: AuthService) { }

  getTareasByOT(code: string): Observable<TareaDetalle[]> {
    const params = new HttpParams().set('Codigo', code); 
    return this.http.get<TareaDetalle[]>(`${this.apiURL}/GetTareaDetalle`, { params });
  } 

  getTareaExternaByOT(code: string): Observable<TrabajoExternoDetalle[]>{
    const headers = this.auth.getAuthHeaders();
    return this.http.get<TrabajoExternoDetalle[]>(`${this.apiURL}/GetTareaExterna/${code}`,{ headers } );
  }
  
  getObservacionesTarea(code:string): Observable<ObservacionesOTDetalle[]>{
    const headers = this.auth.getAuthHeaders();
    return this.http.get<ObservacionesOTDetalle[]>(`${environment.domain}${environment.apiEndpoint}/Observacion/ObtenerObservaciones/${code}`, {headers})
  }
}