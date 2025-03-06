import { Component, OnInit } from '@angular/core';
import { Column, HeadersTables } from '../../shared/util/tables';
import { AdquisicionListResponse } from '../../../../domain/response/Adquisicion.model';
import { Table, TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { CommonModule, NgFor, NgIf } from '@angular/common';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { InputTextModule } from 'primeng/inputtext';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AdquisicionService } from '../../services/adquisicion.service';

@Component({
  selector: 'app-adquisicion',
  imports: [
    TableModule,
    ButtonModule,
    CommonModule,
    NgFor,
    NgIf,
    IconFieldModule,
    InputIconModule,
    InputTextModule,
    FormsModule,
    ReactiveFormsModule,
  ],
  templateUrl: './adquisicion.component.html',
  styleUrl: './adquisicion.component.scss'
})
export class AdquisicionComponent implements OnInit {

  adquisicion: AdquisicionListResponse[] = [];
  cols!: Column[];

  loading: boolean = true;

  constructor( 
    private adquisicionService: AdquisicionService
  ){}
  ngOnInit(): void {
    this.cols = HeadersTables.AdquisicionesList;
    this.adquisicionService.getAdquisicionList().subscribe({
      next: (response) => {
        this.adquisicion = response.compras;
        this.loading = false;
      },error: (err) => {
        console.error(err);
      }
    })
  }

   filterGlobal(event: Event, dt: any) { //filtro para barra de busqueda
      const inputValue = (event.target as HTMLInputElement)?.value || '';
      dt.filterGlobal(inputValue, 'contains');
    }
    clear(table: Table) {
      table.clear();
    }
    formatDate(dateString: string): string {
      if(dateString === 'Vacío') return 'Vacío';
      const date = new Date(dateString);
      const day = date.getDate().toString().padStart(2, '0');
      const month = (date.getMonth() + 1).toString().padStart(2, '0'); // Meses van de 0 a 11
      const year = date.getFullYear();
  
      return `${day}/${month}/${year}`;
    }
    OnExportButton() {}
    showDialogAdd(){}
    showDialogEdit(){}
}
