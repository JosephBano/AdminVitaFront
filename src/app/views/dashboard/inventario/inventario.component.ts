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
  ],
  templateUrl: './inventario.component.html',
  styleUrl: './inventario.component.scss'
})
export class InventarioComponent implements OnInit {
  Items: Item[] = [];
  cols!: Column[];

  loading: boolean = true;

  constructor( 
    private itemService: ItemService,
  ){}

  ngOnInit(): void {
    this.cols = HeadersTables.InventarioList; 
    this.itemService.getItemsList().subscribe({
      next: (response) => {
        this.Items = response;
        this.loading = false;
      },
      error: (err) => console.error(err)
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
