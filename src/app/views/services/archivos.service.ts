import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment.development';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ArchivosService {

  private apiUrl = `${environment.domain}${environment.apiEndpoint}${environment.archivos}`;
  
  constructor(private http:HttpClient) { }

  getArchivo(fileName: string): Observable<Blob> {
    const name = this.obtenerNombreArchivo(fileName);
    return this.http.get(`${this.apiUrl}/Uploads/${name}`, { responseType: 'blob' });
  }

  private obtenerNombreArchivo(ruta: string): string {
    return ruta.split('/').pop() || '';
  }
}
