import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment.development';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ConversionRequest, ConversionResponse } from '../../../domain/response/Conversion.model';
import { AuthService } from '../auth/service/auth.service';

@Injectable({
  providedIn: 'root'
})
export class MagnitudService{

  private apiURL = `${environment.domain}${environment.apiEndpoint}${environment.magnitud}`;
  
  constructor(private http:HttpClient, private auth: AuthService) { }

  getMagnitudes(): Observable<any> {
    return this.http.get<any>(`${this.apiURL}/GetMagnitud`);
  }
  GetMagnitudCompatibleByItem(idItem: number): Observable<any> {
    return this.http.get<any>(`${this.apiURL}/GetMagnitudesCompatibles/${idItem}`);
  }
  convertirUnidad(
    idMagnitudOrigen: number, 
    unidadOrigen: number, 
    idMagnitudDestino: number
  ): Observable<ConversionResponse> {
    const headers = this.auth.getAuthHeaders();
    const requestBody: ConversionRequest = {
      idMagnitudOrigen,
      unidadOrigen,
      idMagnitudDestino
    };
    console.log('Enviando solicitud de conversión:', requestBody);
    return this.http.post<ConversionResponse>(
      `${environment.domain}${environment.apiEndpoint}${environment.conversionUnidades}/ConversionUnidad`, 
      requestBody, 
      { headers }
    );
  }
}
