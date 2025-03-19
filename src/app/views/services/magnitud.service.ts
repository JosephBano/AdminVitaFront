import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment.development';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class MagnitudService{

  private apiURL = `${environment.domain}${environment.apiEndpoint}${environment.magnitud}`;
  
  constructor(private http:HttpClient) { }

  getMagnitudes(): Observable<any> {
    return this.http.get<any>(`${this.apiURL}/GetMagnitud`);
  }
}
