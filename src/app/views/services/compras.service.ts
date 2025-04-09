import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment.development';
import { HttpClient, HttpParams } from '@angular/common/http';
import { AuthService } from '../auth/service/auth.service';
import { Observable } from 'rxjs';
import { SolicitudCrearCompra, RespuestaCreacionCompra } from '../../../domain/response/Compra.model';

@Injectable({
  providedIn: 'root'
})
export class ComprasService {

  private apiURL = `${environment.domain}${environment.apiEndpoint}${environment.adquisicion}`

  constructor(private http: HttpClient, private auth: AuthService) { }

  getComprasList(): Observable<any> {
    const headers = this.auth.getAuthHeaders();
    return this.http.get<any>(`${this.apiURL}/GetListaCompras`, { headers });
  }

  crearCompra(datosCompra: SolicitudCrearCompra): Observable<RespuestaCreacionCompra> {
    let encabezados = this.auth.getAuthHeaders();
    const parametros = new HttpParams()
      .set('IdProveedor', datosCompra.idProveedor.toString())
      .set('NumeroFactura', datosCompra.numeroFactura);
    const formData = new FormData();
    if (datosCompra.archivo) {
      formData.append('file', datosCompra.archivo, datosCompra.archivo.name);
    }
    if (encabezados.has('Content-Type')) {
      encabezados = encabezados.delete('Content-Type');
    }
    const url = `${environment.domain}${environment.apiEndpoint}/compras`;
    return this.http.post<RespuestaCreacionCompra>(
      url, 
      formData, 
      { 
        headers: encabezados,
        params: parametros
      }
    );
  }
  getCompraDetallada(factura: string): Observable<any> {
    return this.http.get<any>(`${this.apiURL}/GetCompraDetallada/${factura}`);
  }
}
