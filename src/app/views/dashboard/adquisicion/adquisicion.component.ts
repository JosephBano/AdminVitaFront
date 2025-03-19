import { Component, OnInit } from '@angular/core';
import { Column, HeadersTables } from '../../shared/util/tables';
import { CompraResponse } from '../../../../domain/response/Adquisicion.model';
import { Table, TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { CommonModule, NgFor, NgIf } from '@angular/common';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { InputTextModule } from 'primeng/inputtext';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ComprasService } from '../../services/Compras.service';
import { Router } from '@angular/router';

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

  compras: CompraResponse[] = [];
  cols!: Column[];

  loading: boolean = true;

  constructor( 
    private comprasService: ComprasService, 
    private router: Router
  ){}
  ngOnInit(): void {
    this.cols = HeadersTables.AdquisicionesList;
    this.comprasService.getComprasList().subscribe({
      next: (response) => {
        this.compras = response.compras;
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
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const year = date.getFullYear();
    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');
  
    return `${day}-${month}-${year} ${hours}:${minutes}`;
  }
  getNameProvider(factura: string){
    const adquisicion = this.compras.find( x => x.numeroFactura == factura);
    if(adquisicion?.razonSocial) return `${adquisicion.nombre} ${adquisicion.razonSocial}`
    return `${adquisicion?.nombre} ${adquisicion?.apellidos}`;
  }
  abrirNuevaPestana() {
    this.router.navigate(['panel/Adquisiciones/agregar']);
  }
  OnExportButton() {}
  showDialogAdd(){}
  showDialogEdit(){}
}
