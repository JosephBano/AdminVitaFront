import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { FloatLabelModule } from 'primeng/floatlabel';
import { InputNumberModule } from 'primeng/inputnumber';
import { InputTextModule } from 'primeng/inputtext';
import { RadioButtonModule } from 'primeng/radiobutton';
import { EstadoTarea } from '../../../shared/util/genericData';
import { SelectModule } from 'primeng/select';
import { DividerModule } from 'primeng/divider';
import { ButtonModule } from 'primeng/button';

@Component({
  selector: 'app-crud-tarea-mecanica',
  imports: [
    CommonModule,
    FormsModule,
    RadioButtonModule,
    InputTextModule,
    FloatLabelModule,
    InputNumberModule,
    SelectModule,
    DividerModule,
    ButtonModule
  ],
  templateUrl: './crud-tarea-mecanica.component.html',
  styleUrl: './crud-tarea-mecanica.component.scss'
})
export class CrudTareaMecanicaComponent implements OnInit{
  
  @Input() codigoOT: any;
  @Input() action: 'agregar' | 'editar' | 'eliminar' = 'agregar';
  @Input() color: any;
  @Output() onClose: EventEmitter<any> = new EventEmitter<any>();

  header_dialog: string = '';

  //formulario
  tipo_tarea: 'interna' | 'externa' = 'interna';
  tipo_mantenimiento: 'preventivo' | 'correctivo' = 'preventivo';
  //formulario interna
  detalleTarea: string = '';
  duracion_tarea: number = 0;
  estado_tarea: any = EstadoTarea[0].code;
  requ_auth: boolean = true;
  requ_repuestos: boolean = true;
  list_repuestos: any [] = [];

  estados_tarea!: any [];

  ngOnInit(): void {
    this.initData();
  }

  initData(){
    this.estados_tarea = EstadoTarea;
    this.headerDialog();
  }

  headerDialog(){
    switch(this.action){
      case 'agregar':
        this.header_dialog = 'Agregar Tarea';
        break;
      case 'editar':
        this.header_dialog = 'Editar Tarea';
        break;
      case 'eliminar':
        this.header_dialog = 'Eliminar Tarea';
        break;
    }
  }
}