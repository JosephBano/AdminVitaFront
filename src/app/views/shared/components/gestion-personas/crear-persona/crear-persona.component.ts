import { Component, Input } from '@angular/core';
import { DialogModule } from 'primeng/dialog';
import { FormularioPersonaComponent } from "../../formulario-persona/formulario-persona.component";

@Component({
  selector: 'app-crear-persona',
  imports: [
    DialogModule,
    FormularioPersonaComponent
],
  templateUrl: './crear-persona.component.html',
  styleUrl: './crear-persona.component.scss'
})
export class CrearPersonaComponent {
  @Input() visible: boolean = false;
  @Input() persona: any;

  responseDialogPropietariosForm(valor: any){
    if (valor) this.visible = false;
  }
}
