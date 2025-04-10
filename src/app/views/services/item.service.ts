import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment.development';
import { HttpClient } from '@angular/common/http';
import { AuthService } from '../auth/service/auth.service';
import { Observable } from 'rxjs';
import { Item } from '../../../domain/response/Item.model';
import { CreateUpdateItemRequest } from '../../../domain/request/Item.model';

@Injectable({
  providedIn: 'root'
})
export class ItemService {
  
  private apiURL = `${environment.domain}${environment.apiEndpoint}${environment.items}`;

  constructor(private http: HttpClient, private auth: AuthService) { }

  getItemsList(): Observable<Item[]> {
    const headers = this.auth.getAuthHeaders();
    return this.http.get<Item[]>(`${this.apiURL}/GetListaItems`, { headers });
  }
  getMovimientosXItems(id: number): Observable<any>{
    const headers = this.auth.getAuthHeaders();
    return this.http.get<any>(`${this.apiURL}/GetMovimientoItem/${id}`, { headers });
  }
  createUpdateItem(item: CreateUpdateItemRequest): Observable<any> {
    return this.http.post<any>(`${this.apiURL}/CreateUpdateItem`, item);
  }
}
