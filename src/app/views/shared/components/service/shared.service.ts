import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SharedService {

  private estadoAddDialog = new BehaviorSubject<boolean>(false); // valor inicial

  estado$ = this.estadoAddDialog.asObservable();

  cambiarEstado(nuevoValor: boolean) {
    this.estadoAddDialog.next(nuevoValor);
  }

  obtenerEstadoActual(): boolean {
    return this.estadoAddDialog.getValue();
  }
}
