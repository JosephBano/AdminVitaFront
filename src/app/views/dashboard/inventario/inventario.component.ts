import { Component, OnInit } from '@angular/core';
import { Column, HeadersTables } from '../../shared/util/tables';
import { Item } from '../../../../domain/response/Item.model';
import { ItemService } from '../../services/item.service';
import { CommonModule, NgFor, NgIf } from '@angular/common';
import { Table, TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { InputTextModule } from 'primeng/inputtext';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { DialogModule } from 'primeng/dialog';
import { SkeletonSimpleComponent } from '../../shared/components/skeleton-simple.component';

@Component({
  selector: 'app-inventario',
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
    DialogModule,
    SkeletonSimpleComponent,
  ],
  templateUrl: './inventario.component.html',
  styleUrl: './inventario.component.scss'
})
export class InventarioComponent implements OnInit {
  Items: Item[] = [];
  cols!: Column[];

  loading: boolean = true;
  loadingMovimientosDialog: boolean = true;

  colsMovimientos!: Column[];
  movimientos: any[] =[];

  visiblePropietarios:boolean = false;

  constructor( 
    private itemService: ItemService,
  ){}

  ngOnInit(): void {
    this.initData();
  }
  initData(){
    this.cols = HeadersTables.InventarioList; 
    this.colsMovimientos = HeadersTables.MovimientosItemList;
    this.itemService.getItemsList().subscribe({
      next: (response) => {
        this.Items = response;
        this.loading = false;
      },
      error: (err) => console.error(err)
    })
    
  }
  showMovimientosItem(codigo: number){
    this.visiblePropietarios = true;
    this.itemService.getMovimientosXItems(codigo).subscribe({
      next: (response) => {
        this.movimientos = response;
        this.loadingMovimientosDialog = false;
      }
    })
  }

  clear(table: Table) {
    table.clear();
  }

  filterGlobal(event: Event, dt: any) { //filtro para barra de busqueda
    const inputValue = (event.target as HTMLInputElement)?.value || '';
    dt.filterGlobal(inputValue, 'contains');
  }
}
