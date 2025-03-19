import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment.development';
import { HttpClient } from '@angular/common/http';
import { AuthService } from '../auth/service/auth.service';
import { Observable } from 'rxjs';

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


}
