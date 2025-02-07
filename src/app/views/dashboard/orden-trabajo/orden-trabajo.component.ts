import { CommonModule, NgFor, NgIf } from '@angular/common';
import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { Table, TableModule } from 'primeng/table';
import { OrdenTrabajoService } from '../../services/orden-trabajo.service';
import { ordenTrabajoList } from '../../../../domain/response/OrdenTrabajo.model';
import { Column, HeadersTables } from '../../../../domain/tables';
import { ButtonModule } from 'primeng/button';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { InputTextModule } from 'primeng/inputtext';
import { FormsModule, Validators } from '@angular/forms';
import { DialogModule } from 'primeng/dialog';
import { AuthService } from '../../auth/service/auth.service';
import { TextareaModule } from 'primeng/textarea';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { FloatLabel } from 'primeng/floatlabel';
import { SelectModule } from 'primeng/select';
import { DatePickerModule } from 'primeng/datepicker';

interface selectT {
  name: string;
  code: string;
}

@Component({
  selector: 'app-orden-trabajo',
  imports: [
    CommonModule,
    TableModule,
    NgFor,
    NgIf,
    ButtonModule,
    IconFieldModule,
    InputIconModule,
    InputTextModule,
    FormsModule,
    DialogModule,
    TextareaModule,
    ReactiveFormsModule,
    FloatLabel,
    SelectModule,
    DatePickerModule,
  ],
  standalone: true,
  templateUrl: './orden-trabajo.component.html',
  styleUrl: './orden-trabajo.component.scss',
  encapsulation: ViewEncapsulation.None
})

export class OrdenTrabajoComponent implements OnInit {

  ordenes: ordenTrabajoList[] = [];
  cols!: Column[];

  loading: boolean = true;

  visibleAdd: boolean = false;      

  fb_addOt!: FormGroup;

  estado!: selectT[];
  prioridad!: selectT[];
  supervisor!: selectT[];

  minDate: Date | undefined;

  constructor(
    private otservice: OrdenTrabajoService,
    private auth: AuthService  
  ) {}

  ngOnInit() {    
    this.cols = HeadersTables.OrdenesTrabajoList;
    this.minDate = new Date();
    this.otservice.getOrdenesTrabajoListado().subscribe({
      next: (response) => {
        this.ordenes = response.ordenes.map(x => ({
          ...x, // Mantiene los otros atributos del objeto
          fechaProgramada: this.formatDate(x.fechaProgramada) // Formatea solo la fecha
        }));
        this.loading = false;
      },
      error: (err) => {
        console.log("Error al solicitar Ordenes de Trabajo: ", err);
      },
    });
    
    this.estado = [
      {name: 'Pendiente', code: '1'},
      {name: 'En Proceso', code: '2'},
      {name: 'Finalizado', code: '3'}];
    
    this.prioridad = [
      {name: 'Alta', code: '1'},
      {name: 'Media', code: '2'},
      {name: 'Baja', code: '3'}];

    this.supervisor = [
      {name: 'Juan Perez', code: '1'},
      {name: 'Maria Martinez', code: '2'},
      {name: 'Pedro Garcia', code: '3'}];
    
    this.fb_addOt = new FormGroup({
      detalle: new FormControl('', [Validators.required, Validators.minLength(2)]),
      num_documento: new FormControl('', [Validators.required, Validators.minLength(2)]),
      placa: new FormControl('', [Validators.required, Validators.minLength(2)]),
      estado: new FormControl<selectT | null>(null),
      prioridad: new FormControl<selectT | null>(null),
      supervisor: new FormControl<selectT | null>(null),
      fechaProgramada: new FormControl<selectT | null>(null),
    }); 
  }

  formatDate(dateString: string): string {
    const date = new Date(dateString);
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0'); // Meses van de 0 a 11
    const year = date.getFullYear();

    return `${day}/${month}/${year}`;
  }

  clear(table: Table) {
    table.clear();
  }

  showDialogAdd() {
    this.visibleAdd = true;
  }  
}
