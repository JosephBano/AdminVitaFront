import { Component, OnInit, ViewChild } from '@angular/core';
import { Column, HeadersTables } from '../../shared/util/tables';
import { Item } from '../../../../domain/response/Item.model';
import { ItemService } from '../../services/item.service';
import { CommonModule, DatePipe, NgFor, NgIf } from '@angular/common';
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
  providers: [DatePipe], 
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
  @ViewChild('dt5') dt5!: Table; 
  Items: Item[] = [];
  cols!: Column[];

  loading: boolean = true;
  loadingMovimientosDialog: boolean = true;

  colsMovimientos!: Column[];
  movimientos: any[] =[];

  visibleMovimientos:boolean = false;
  visibleCrearItem: boolean = false;

  constructor( 
    private itemService: ItemService,
    private datePipe: DatePipe
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
    this.visibleMovimientos = true;
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
  exportCSV() {
    if (!this.dt5) {
      console.error('La tabla no está lista para exportar. Intente nuevamente en unos segundos.');
      return;
    }
    const datosParaExportar = this.dt5.filteredValue || this.Items;
    const exportData = datosParaExportar.map(item => {
      const itemExport: Record<string, any> = {};
      this.cols.forEach(col => {
        if (!col.field || !col.header) return;
        if (col.field === 'magnitud') {
          itemExport[col.header] = item['nombreMagnitud'] || '';
        }
        // Caso especial para valores monetarios
        else if (col.field === 'valorUnitario') {
          itemExport[col.header] = `$${Number(item[col.field]).toFixed(2)}`;
        }
        // Caso general para otros campos
        else if (col.field !== 'actions') { // Excluir columna de acciones
          itemExport[col.header] = item[col.field] !== undefined ? item[col.field] : '';
        }
      });
      return itemExport;
    });
    
    // Exportar a Excel
    import('xlsx').then(xlsx => {
      const worksheet = xlsx.utils.json_to_sheet(exportData);
      const workbook = { Sheets: { 'Inventario': worksheet }, SheetNames: ['Inventario'] };
      const excelBuffer = xlsx.write(workbook, { bookType: 'xlsx', type: 'array' });
      
      this.saveAsExcelFile(excelBuffer, "inventario");
    }).catch(err => {
      console.error('Error al exportar a Excel:', err);
    });
  }
  saveAsExcelFile(buffer: any, fileName: string): void {
  const EXCEL_TYPE = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
  const EXCEL_EXTENSION = '.xlsx';
  const data: Blob = new Blob([buffer], { type: EXCEL_TYPE });
  // Crear enlace de descarga
  const url = window.URL.createObjectURL(data);
  const a = document.createElement('a');
  document.body.appendChild(a);
  a.href = url;
  a.download = fileName + '_' + this.datePipe.transform(new Date(), 'yyyy-MM-dd') + EXCEL_EXTENSION;
  a.click();
  window.URL.revokeObjectURL(url);
  document.body.removeChild(a);
  }
  OnExportButton() {
    try {
      this.exportCSV();
    } catch (error) {
      console.error('Error al exportar datos:', error);
    }
  }
}
