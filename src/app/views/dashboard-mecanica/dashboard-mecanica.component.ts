import { Component, OnInit, ViewChild } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { ThemedLayoutComponent } from '../../layout/component/app.themed-layout';
import { ordenTrabajoList } from '../../../domain/response/OrdenTrabajoResponse.model';
import { OrdenTrabajoService } from '../services/orden-trabajo.service';
import { EstadosOTs, EstadosVehiculo, genericT, PrioridadesOT } from '../shared/util/genericData';
import { HeadersTables } from '../shared/util/tables';
import { Table, TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { TagModule } from 'primeng/tag';
import { DropdownModule } from 'primeng/dropdown';
import { FormsModule } from '@angular/forms';
// Define una interfaz para las columnas que coincida con ambos tipos
interface TableColumn {
  field: string;
  header: string;
  sort: boolean;
  type: string;
}

@Component({
  selector: 'app-dashboard-mecanica',
  standalone: true,
  imports: [
    ThemedLayoutComponent,  
    CommonModule,
    TableModule,
    ButtonModule,
    InputTextModule,
    TagModule,
    DropdownModule,
    FormsModule
  ],
  providers: [DatePipe, OrdenTrabajoService],
  templateUrl: './dashboard-mecanica.component.html',
  styleUrls: ['./dashboard-mecanica.component.scss']
})
export class DashboardMecanicaComponent implements OnInit {
  ordenes: ordenTrabajoList[] = [];
  cols!: TableColumn[]; // Cambiado el tipo de columna
  loading: boolean = true;
  
  estado!: genericT[];
  prioridad!: genericT[];
  estadoVehiculo!: genericT[]; // Añadida la propiedad faltante
  minDate!: Date; // Añadida la propiedad faltante
  selectedEstadoFilter!: genericT;
  selectedPrioridadFilter!: genericT;
  
  isDarkModeEnabled = false;
  constructor(
    private otService: OrdenTrabajoService,
    private datePipe: DatePipe
  ) {}

  // Método para recibir el cambio de tema desde el componente toggle
  onThemeChanged(isDarkMode: boolean): void {
    console.log('Dashboard recibió isDarkMode:', isDarkMode);
    this.isDarkModeEnabled = isDarkMode;
    localStorage.setItem('dashboard-mecanica-theme', isDarkMode ? 'dark' : 'light');
  }
  
  ngOnInit(): void {
    // Restaurar preferencia de tema
    const savedTheme = localStorage.getItem('dashboard-mecanica-theme');
    if (savedTheme) {
      this.isDarkModeEnabled = savedTheme === 'dark';
    }
    
    // Asignación con el tipo correcto
    this.cols = HeadersTables.OrdenesTrabajoList as TableColumn[];
    this.estado = EstadosOTs;
    this.prioridad = PrioridadesOT;
    this.estadoVehiculo = EstadosVehiculo;
    this.minDate = new Date();

    // Obtener los datos de órdenes de trabajo
    this.otService.getOrdenesTrabajoListado().subscribe({
      next: (response) => {
        this.ordenes = response.ordenes.map(x => ({
          ...x,
          fechaProgramada: this.formatDate(x.fechaProgramada)
        }));
        this.loading = false;
      },
      error: (err: any) => {
        console.log("Error al solicitar Ordenes de Trabajo: ", err);
      },
    });
  }
  
  formatDate(dateString: string): string {
    if(dateString === 'Vacío') return 'Vacío';
    // Usar DatePipe para formatear la fecha
    const formattedDate = this.datePipe.transform(dateString, 'dd/MM/yyyy');
    return formattedDate || 'Fecha inválida';
  }

  // Método para filtro global
  filterGlobal(event: Event, dt: any) { 
    const inputValue = (event.target as HTMLInputElement)?.value || '';
    dt.filterGlobal(inputValue, 'contains');
  }

  // Método para limpiar filtros
  clear(table: Table) {
    table.clear();
  }

  // Métodos para obtener textos descriptivos
  GetEstado(id: number)  {
    const item = this.estado.find(x => x.code === id);  
    return item?.name;
  }

  GetPrioridad(id: number)  {
    const item = this.prioridad.find(x => x.code === id);  
    return item?.name;
  }

  // Métodos para obtener severities de los tags
  getSeverityEstado(status: number) {
    switch (status) {
      case 0: return undefined;
      case 1: return 'success';
      case 2: return 'warn';
      case 3: return 'danger';
      default:
        return 'secondary';
    }
  }

  getSeverityPrioridad(status: number) {
    switch (status) {
      case 4: return 'secondary';
      case 3: return 'info';
      case 2: return 'contrast';
      case 1: return 'warn';
      case 0: return 'danger';  
      default: 
        return undefined;
    }
  }
}