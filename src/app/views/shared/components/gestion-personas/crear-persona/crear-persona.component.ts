import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { DialogModule } from 'primeng/dialog';
import { FormularioPersonaComponent } from "../../formulario-persona/formulario-persona.component";
import { SharedService } from '../../service/shared.service';

@Component({
  selector: 'app-crear-persona',
  imports: [
    DialogModule,
    FormularioPersonaComponent
],
  templateUrl: './crear-persona.component.html',
  styleUrl: './crear-persona.component.scss'
})
export class CrearPersonaComponent implements OnInit{
  @Input() visible: boolean = false;
  @Input() persona: any;
  @Output() formSubmitted = new EventEmitter<any>();

  titleDialog!: string;

  constructor(private sharedService: SharedService) { }

  ngOnInit(): void {
    this.titlePersona();  
    this.sharedService.estado$.subscribe(valor => {
      this.visible = valor;
    });
  }
  titlePersona(){
      switch(this.persona){
        case 'persona':
          this.titleDialog = 'Crear Persona';
          break;
        case'mecanico':
          this.titleDialog = 'Crear Mecanico';
          break;
        case 'proveedor':
          this.titleDialog = 'Crear Proveedor';
          break;
        case 'propietario':
          this.titleDialog = 'Cambiar Propietario';
          break;
        case 'user':
          this.titleDialog = 'Crear Usuario';
          break;
      }
    }
  responseDialogPropietariosForm(valor: any){
    if (valor) {
      this.visible = false;
      this.sharedService.cambiarEstado(false);
      this.formSubmitted.emit(false);
    }
  }
}
