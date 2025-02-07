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
import { FormsModule } from '@angular/forms';
import { DialogModule } from 'primeng/dialog';
import { AuthService } from '../../auth/service/auth.service';

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

  constructor(
    private otservice: OrdenTrabajoService,
    private auth: AuthService  
  ) {}

  ngOnInit() {    
    this.cols = HeadersTables.OrdenesTrabajoList;
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
    })    
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
