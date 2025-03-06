import { CommonModule, NgFor, NgIf } from '@angular/common';
import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { Table, TableModule } from 'primeng/table';
import { OrdenTrabajoService } from '../../services/orden-trabajo.service';
import { OrdenTrabajo, ordenTrabajoList } from '../../../../domain/response/OrdenTrabajoResponse.model';
import { Column, HeadersTables } from '../../shared/util/tables';
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
import { MecanicoService } from '../../services/mecanico.service';
import { EstadosOTs, EstadosVehiculo, genericT, PrioridadesOT } from '../../shared/util/genericData';
import { TagModule } from 'primeng/tag';
import { SelectButtonModule } from 'primeng/selectbutton';
import { BadgeModule } from 'primeng/badge';
import { DropdownModule } from 'primeng/dropdown';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { ValidacionService } from '../../services/validacion.service';
import { ToastrService } from 'ngx-toastr';
import { ActualizarOrdenRequest, AgendarOrdenTrabajo } from '../../../../domain/request/OrdenTrabajoRequest.model';
import { DividerModule } from 'primeng/divider';
import { SkeletonExpandInfoComponent } from '../../shared/components/skeleton-expand-info.component';
import { SkeletonSimpleComponent } from '../../shared/components/skeleton-simple.component';
import { TareasService } from '../../services/tareas.service';
import { RepuestoService } from '../../services/repuesto.service';
import { SolicitudService } from '../../services/solicitud.service';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { DatePipe } from '@angular/common';
import { forkJoin } from 'rxjs';

interface jsPDFWithAutoTable extends jsPDF {
  lastAutoTable: {
    finalY: number;
  };
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
    TagModule,
    SelectButtonModule,
    BadgeModule,
    DropdownModule,
    ProgressSpinnerModule,
    DividerModule,
    SkeletonExpandInfoComponent,
    SkeletonSimpleComponent
  ],
  standalone: true,
  templateUrl: './orden-trabajo.component.html',
  styleUrl: './orden-trabajo.component.scss',
  encapsulation: ViewEncapsulation.None,
  providers: [DatePipe]
})

export class OrdenTrabajoComponent implements OnInit {

  ordenes: ordenTrabajoList[] = [];
  cols!: Column[];

  expandDataTables: any[]=[]
  expandCols: Column[] = [];

  loading: boolean = true;
  loadingEditDialog: boolean = true;
  loadingExpandDialog: boolean = true;

  visibleAdd: boolean = false;   
  visibleEdit: boolean = false;   
  visibleExpand: boolean = false;

  fb_addOt!: FormGroup;
  fb_editOt!: FormGroup;

  estado!: genericT[];
  prioridad!: genericT[];
  supervisor!: genericT[];
  estadoVehiculo!: genericT[];

  selectedEstadoFilter!: genericT;
  selectedPrioridadFilter!: genericT;

  minDate: Date | undefined;

  codeEditDialog: string = '';
  codeExpandDialog: string = '';

  ExpandOptionsValue!: string;
  ExpandOptions!: genericT[];
  ExpandItem: OrdenTrabajo = {
    codigo: '',
    detalle: '',
    prioridad: 0,
    estado: 0,
    fechaCreada: new Date(),
    fechaProgramada: new Date(),
    fechaFinalizacion: new Date(),
    observacion: '',
    codigoVehiculo: '',
    kilometraje: 0,
    numeroVehiculo: 0,
    anio: new Date(),
    estadoVehiculo: '',
    propietario: '',
    placa: '',
    nombreCliente: '',
    celular: '',
    correo: '',
    direccion: '',
    supervisor: 0
  };

  iconValidarDocumento: string = 'pi pi-search';
  iconValidarPlaca: string = 'pi pi-search';
  

  allTablesData: {
    tareas: any[];
    repuestos: any[];
    mecanicos: any[];
    trabajosExternos: any[];
    observaciones: any[];
    solicitudes: any[];
  } = {
    tareas: [],
    repuestos: [],
    mecanicos: [],
    trabajosExternos: [],
    observaciones: [],
    solicitudes: []
  };

  constructor(
    private otService: OrdenTrabajoService,
    private auth: AuthService,
    private mecService: MecanicoService,  
    private validacionService: ValidacionService,
    private toastr: ToastrService,
    private tareaService: TareasService,
    private repuestoService: RepuestoService,
    private solicitudService: SolicitudService,
    private datePipe: DatePipe
  ) {}

  ngOnInit() {    
    this.cols = HeadersTables.OrdenesTrabajoList;
    this.estado = EstadosOTs;
    this.prioridad = PrioridadesOT;
    this.estadoVehiculo = EstadosVehiculo;
    this.minDate = new Date();

    this.otService.getOrdenesTrabajoListado().subscribe({
      next: (response) => {
        this.ordenes = response.ordenes.map(x => ({
          ...x,
          fechaProgramada: this.formatDate(x.fechaProgramada)
        }));
        this.loading = false;
      },
      error: (err) => {
        console.log("Error al solicitar Ordenes de Trabajo: ", err);
      },
    });

    this.mecService.getSupervisores().subscribe({
      next: (response) => {
        this.supervisor = response.map(x => ({
          name: x.nombre,
          code: x.idMecanico
        }));        
      },
      error: (err) => {
        console.log("Error al solicitar Supervisores: ", err);
      },
    })
    
    this.fb_addOt = new FormGroup({
      detalle: new FormControl<string | null>(null, [Validators.required, Validators.minLength(10)]),
      num_documento: new FormControl<string | null>(null, [Validators.required, Validators.minLength(10), Validators.maxLength(16)]),
      clienteId: new FormControl<number | null>(null, [Validators.required]),
      placa: new FormControl<string | null>(null, [Validators.required, Validators.minLength(7), Validators.maxLength(8)]),
      vehiculoId: new FormControl<number | null>(null, [Validators.required]),
      prioridad: new FormControl<genericT | null>(null, [Validators.required]),
      supervisor: new FormControl<genericT | null>(null, [Validators.required]),
      fechaProgramada: new FormControl<Date | null>(null, [Validators.required]),
      observacion: new FormControl<string | null>(null),
    }); 

    this.fb_editOt = new FormGroup({
      detalle: new FormControl<string | null>(null),
      nombreCliente: new FormControl<string | null>(null),
      placa: new FormControl<string | null>(null),
      estado: new FormControl<genericT | null>(null, [Validators.required]),
      prioridad: new FormControl<genericT | null>(null, [Validators.required]),
      supervisor: new FormControl<genericT | null>(null, [Validators.required]),
      fechaProgramada: new FormControl<Date | null>(null, [Validators.required]),
      observacion: new FormControl<string | null>(null),
    }); 

    this.fb_addOt.get('num_documento')?.valueChanges.subscribe(() => {
      this.fb_addOt.patchValue({clienteId: null});;
      this.iconValidarDocumento = 'pi pi-search';
    });

    this.fb_addOt.get('placa')?.valueChanges.subscribe(() => {
      this.fb_addOt.patchValue({vehiculoId: null})
      this.iconValidarPlaca = 'pi pi-search';
    })
  }
  formatDate(dateString: string): string {
    if(dateString === 'Vacío') return 'Vacío';
    const date = new Date(dateString);
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0'); // Meses van de 0 a 11
    const year = date.getFullYear();

    return `${day}/${month}/${year}`;
  }
  filterGlobal(event: Event, dt: any) { //filtro para barra de busqueda
    const inputValue = (event.target as HTMLInputElement)?.value || '';
    dt.filterGlobal(inputValue, 'contains');
  }
  clear(table: Table) {
    table.clear();
  }
  showDialogAdd() {
    this.visibleAdd = true;
  }  
  showDialogEdit(code: string) {
    this.visibleEdit = true;
    this.loadingEditDialog = true;
    this.codeEditDialog = code;
    this.otService.getOrdenTrabajoCodigo(code).subscribe({
      next: (response: OrdenTrabajo) => {        
        this.fb_editOt.patchValue({
          detalle: response.detalle,
          nombreCliente: response.nombreCliente,
          placa: response.placa,
          estado: response.estado,
          prioridad: response.prioridad,
          supervisor: response.supervisor,
          fechaProgramada: new Date(response.fechaProgramada),
          observacion: response.observacion,
        })
        this.fb_editOt.get('detalle')?.disable();
        this.fb_editOt.get('nombreCliente')?.disable();
        this.fb_editOt.get('placa')?.disable();

        this.loadingEditDialog = false;
      },
      error: (err) => {
        console.log("Error al solicitar Orden de Trabajo: ", err);
      }
    }) 
  }
  showDialogExpand(code: string){
    this.visibleExpand = true;
    this.loadingExpandDialog = true;
    this.codeExpandDialog = code;
    
    this.otService.getOrdenTrabajoCodigo(code).subscribe({
      next: (response) =>{
        this.ExpandItem = response;
        this.otService.getResumen(code).subscribe({
          next: (response) => {        
            this.ExpandOptions =[
              {code: response.totalTareas, name: 'Tareas'},
              {code: response.totalRepuestos, name: 'Repuestos'},
              {code: response.totalRepuestos, name: 'Mecanicos'},
              {code: response.totalTrabajosExternos, name: 'Trabajos Externos'},
              {code: response.totalObservaciones, name: 'Observaciones'},
              {code: response.totalSolicitudes, name: 'Solicitudes'}
            ];
            this.loadingExpandDialog = false;
          },
          error: (err) => {
            console.log("Error al solicitar Resumen de Orden de Trabajo: ", err);
          }
        });
      }
    })
  }
  createOT():void{
    //Contenido validacion
    const ot: AgendarOrdenTrabajo = {
      codigoUsuario: this.auth.getUserCode(),
      idCliente: this.fb_addOt.get('clienteId')?.value,
      idVehiculo: this.fb_addOt.get('vehiculoId')?.value,
      idMecanico: this.fb_addOt.get('supervisor')?.value,
      detalle: this.fb_addOt.get('detalle')?.value,
      prioridad: this.fb_addOt.get('prioridad')?.value,
      estado: 0, //Por defecto se pone en estado 'Activo'
      fechaProgramada: this.fb_addOt.get('fechaProgramada')?.value,
      observacion: this.fb_addOt.get('observacion')?.value,
    }
    this.otService.createOrdenTrabajo(ot).subscribe({
      next: (response) => {
        this.toastr.success(response.message, "Orden de Trabajo agendada exitosamente!");
        this.visibleAdd = false;
        console.log(response);
      },
      error: (err) => {
        this.toastr.error(err.error, "Orden de Trabajo no pudo ser agendada!");
        console.log(err);'' 
      }
    });
  }
  updateOT():void{
    const ot: ActualizarOrdenRequest = {
      codigo: this.codeEditDialog,
      estado: this.fb_editOt.get('estado')?.value,
      prioridad: this.fb_editOt.get('prioridad')?.value,
      idMecanico: this.fb_editOt.get('supervisor')?.value,
      fechaProgramada: this.fb_editOt.get('fechaProgramada')?.value,
      observacion: this.fb_editOt.get('observacion')?.value,
    }
    console.log(ot);
    
    this.otService.updateOrdenTrabajo(ot).subscribe({
      next: (response) => {
        this.toastr.success(response.message, "Actualización exitosa!");
        this.visibleEdit = false;
        console.log(response);
        
      },
      error: (err) => {
        this.toastr.error(err.error, "Actualización sin éxito!");
        console.log(err);
        
      }
    });
  }
  GetEstado(id: number)  {
    const item = this.estado.find(x => x.code === id);  
    return item?.name;
  }
  GetPrioridad(id: number)  {
    const item = this.prioridad.find(x => x.code === id);  
    return item?.name;
  }
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
  OnExportButton() {
    this.otService.exportAllToExcel().subscribe(response => {
      const blob = new Blob([response], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'OrdenesTrabajo.xlsx';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
    }, error => {
      console.error('Error al exportar el archivo:', error);
    });
  }
  validarDocumento() {
    this.iconValidarDocumento = ''
    const numDocumento = this.fb_addOt.get('num_documento')?.value;
    this.validacionService.validarClienteXDoc(numDocumento).subscribe({
      next: (response) => {
        if(response.esClienteActivo){
          this.fb_addOt.patchValue({clienteId: response.idPersona});
          this.iconValidarDocumento = 'pi pi-check';
        }
        this.iconValidarDocumento = 'pi pi-check';  
      },
      error: (err) => {
        this.iconValidarDocumento = 'pi pi-search';
        this.toastr.warning(err.error, "Persona no encontrada!");
      }
    })
  }
  validarPlaca() {
    const placa = this.fb_addOt.get('placa')?.value;
    this.validacionService.validarVehiculoXPlaca(placa).subscribe({
      next: (response) => {
        this.fb_addOt.patchValue({vehiculoId: response.idVehiculo});  
        this.iconValidarPlaca = 'pi pi-check';
      },
      error: (err) => {
        this.iconValidarPlaca = 'pi pi-search';
        this.toastr.warning(err.error, "Vehiculo no encontrado!");
      }
    });
  }
  getSupervisor(id: number) {
    return this.supervisor.find(s => s.code === id)?.name;
  }
  getEstadoVehiculo(id:string) {
    return this.estadoVehiculo.find(e => e.code.toString() == id)?.name;
  }
  tablesOptionHandler(){
    switch(this.ExpandOptionsValue){
      case 'Tareas':
        this.tareaService.getTareasByOT(this.codeExpandDialog).subscribe({
          next: (response) => {
            this.expandDataTables = response;
            this.expandCols = HeadersTables.TareasList;
          },
          error: (err) => {
            console.log(err);
          }
        })
        break;
      case 'Repuestos':
        this.repuestoService.getRepuestosInsumosByOT(this.codeExpandDialog).subscribe({
          next: (response) => {
            this.expandDataTables = response;            
            this.expandCols = HeadersTables. RepuestoseInsumosList;
          },
          error: (err) => {
            console.log(err);
          }
        })
        break;
      case 'Mecanicos':
        this.mecService.getManoObraOT(this.codeExpandDialog).subscribe({
          next: (response) => {
            this.expandDataTables = response;
            this.expandCols = HeadersTables.ManoDeObraList;
          },
          error: (err) => {
            console.log(err);
          }
        });
        break;
      case 'Trabajos Externos':
        this.tareaService.getTareaExternaByOT(this.codeExpandDialog).subscribe({
          next: (response) => {
            this.expandDataTables = response;
            this.expandCols = HeadersTables.TrabajoExternoList;
          },
          error: (err) => console.log(err)
        })
        break;
      case 'Observaciones': 
        this.tareaService.getObservacionesTarea(this.codeExpandDialog).subscribe({
          next: (response) => {
            this.expandDataTables = response;
            this.expandCols = HeadersTables.ObservacionesTareaList;
          },
          error: (err) => console.log(err)
        })
        break;
      case 'Solicitudes':
        this.solicitudService.getSolicitudRepuestoTablaExpandOT(this.codeExpandDialog).subscribe({
          next: (response) => {
            this.expandDataTables = response;
            this.expandCols = HeadersTables.SolicitudTareaList;
          },
          error: (err) => console.log(err)
        })
        break;
      default:
        this.expandCols = [];
        this.expandDataTables = []
    }
  }

  loadAllDataForPDF(otCode: string) {
    // Crear un objeto para almacenar las peticiones
    const requests = {
      tareas: this.tareaService.getTareasByOT(otCode),
      repuestos: this.repuestoService.getRepuestosInsumosByOT(otCode),
      mecanicos: this.mecService.getManoObraOT(otCode),
      trabajosExternos: this.tareaService.getTareaExternaByOT(otCode),
      observaciones: this.tareaService.getObservacionesTarea(otCode),
      solicitudes: this.solicitudService.getSolicitudRepuestoTablaExpandOT(otCode)
    };

    // Ejecutar todas las peticiones en paralelo
    return forkJoin(requests);
  }

  exportCompletePDF() {
    // Mostrar un indicador de carga
    // (implementar según el sistema de UI que estés usando)
    
    // Cargar todos los datos
    this.loadAllDataForPDF(this.codeExpandDialog).subscribe({
      next: (data: any) => {
        // Guardar todos los datos
        this.allTablesData.tareas = data.tareas;
        this.allTablesData.repuestos = data.repuestos;
        this.allTablesData.mecanicos = data.mecanicos;
        this.allTablesData.trabajosExternos = data.trabajosExternos;
        this.allTablesData.observaciones = data.observaciones;
        this.allTablesData.solicitudes = data.solicitudes;
        
        // Generar el PDF con todos los datos
        this.generateCompletePDF();
      },
      error: (err: any) => {
        console.error('Error al cargar datos para el PDF:', err);
        // Mostrar mensaje de error al usuario
      }
    });
  }

  // Generar el PDF completo
  generateCompletePDF() {
    const doc = new jsPDF('p', 'mm', 'a4') as jsPDFWithAutoTable;
    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();
    let y = 10; // Posición Y inicial
    
    // Configurar título del documento
    doc.setFontSize(16);
    doc.setFont('helvetica', 'bold');
    doc.text('Orden de Trabajo: ' + this.codeExpandDialog, pageWidth / 2, y, { align: 'center' });
    y += 10;
    
    // Agregar fecha de generación
    doc.setFontSize(8);
    doc.setFont('helvetica', 'italic');
    const currentDate = this.datePipe.transform(new Date(), 'dd/MM/yyyy HH:mm:ss');
    doc.text(`Generado el: ${currentDate}`, pageWidth - 15, 10, { align: 'right' });
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(10);
    
    // Sección: Descripción
    this.addSectionTitle(doc, 'Descripción', y);
    y += 7;
    this.addKeyValueTable(doc, [
      { key: 'Detalle', value: this.ExpandItem.detalle || 'No disponible' },
      { key: 'Prioridad', value: this.GetPrioridad(this.ExpandItem.prioridad) || 'No disponible' },
      { key: 'Estado', value: this.GetEstado(this.ExpandItem.estado) || 'No disponible' },
      { key: 'Fecha inicio', value: this.formatDate(this.ExpandItem.fechaCreada ? this.ExpandItem.fechaCreada.toString() : 'Vacío') },
      { key: 'Fecha programada', value: this.formatDate(this.ExpandItem.fechaProgramada ? this.ExpandItem.fechaProgramada.toString() : 'Vacío') },
      { key: 'Fecha fin', value: this.formatDate(this.ExpandItem.fechaFinalizacion ? this.ExpandItem.fechaFinalizacion.toString() : 'Vacío') }
    ], y);
    y += 30;
    
    // Sección: Vehículo
    this.addSectionTitle(doc, 'Vehículo', y);
    y += 7;
    this.addKeyValueTable(doc, [
      { key: 'Código', value: this.ExpandItem.codigoVehiculo || 'No disponible' },
      { key: 'Placa', value: this.ExpandItem.placa || 'No disponible' },
      { key: 'Kilometraje', value: (this.ExpandItem.kilometraje || '0') + ' km' },
      { key: 'Año', value: this.formatDate(this.ExpandItem.anio ? this.ExpandItem.anio.toString() : 'Vacío') },
      { key: 'Estado (Institucional)', value: this.getEstadoVehiculo(this.ExpandItem.estadoVehiculo) || 'No disponible' },
      { key: 'Propietario', value: this.ExpandItem.propietario || 'No disponible' }
    ], y);
    y += 30;
    
    // Sección: Cliente
    this.addSectionTitle(doc, 'Cliente', y);
    y += 7;
    this.addKeyValueTable(doc, [
      { key: 'Nombre', value: this.ExpandItem.nombreCliente || 'No disponible' },
      { key: 'Celular', value: this.ExpandItem.celular || 'No disponible' },
      { key: 'Correo', value: this.ExpandItem.correo || 'No disponible' },
      { key: 'Dirección', value: this.ExpandItem.direccion || 'No disponible' },
      { key: 'Supervisor', value: this.getSupervisor(this.ExpandItem.supervisor) || 'No disponible' }
    ], y);
    y += 30;
    
    // Agregar todas las tablas de datos
    
    // 1. Tareas
    if (this.allTablesData.tareas && this.allTablesData.tareas.length > 0) {
      this.checkAndAddPage(doc, y, 40);
      y = this.addTableToDocument(doc, 'Tareas', this.allTablesData.tareas, HeadersTables.TareasList, y);
      y += 10;
    }
    
    // 2. Repuestos
    if (this.allTablesData.repuestos && this.allTablesData.repuestos.length > 0) {
      this.checkAndAddPage(doc, y, 40);
      y = this.addTableToDocument(doc, 'Repuestos', this.allTablesData.repuestos, HeadersTables.RepuestoseInsumosList, y);
      y += 10;
    }
    
    // 3. Mecánicos
    if (this.allTablesData.mecanicos && this.allTablesData.mecanicos.length > 0) {
      this.checkAndAddPage(doc, y, 40);
      y = this.addTableToDocument(doc, 'Mecánicos', this.allTablesData.mecanicos, HeadersTables.ManoDeObraList, y);
      y += 10;
    }
    
    // 4. Trabajos Externos
    if (this.allTablesData.trabajosExternos && this.allTablesData.trabajosExternos.length > 0) {
      this.checkAndAddPage(doc, y, 40);
      y = this.addTableToDocument(doc, 'Trabajos Externos', this.allTablesData.trabajosExternos, HeadersTables.TrabajoExternoList, y);
      y += 10;
    }
    
    // 5. Observaciones
    if (this.allTablesData.observaciones && this.allTablesData.observaciones.length > 0) {
      this.checkAndAddPage(doc, y, 40);
      y = this.addTableToDocument(doc, 'Observaciones', this.allTablesData.observaciones, HeadersTables.ObservacionesTareaList, y);
      y += 10;
    }
    
    // 6. Solicitudes
    if (this.allTablesData.solicitudes && this.allTablesData.solicitudes.length > 0) {
      this.checkAndAddPage(doc, y, 40);
      y = this.addTableToDocument(doc, 'Solicitudes', this.allTablesData.solicitudes, HeadersTables.SolicitudTareaList, y);
    }
    
    // Agregar numeración de páginas
    const totalPages = doc.getNumberOfPages();
    for (let i = 1; i <= totalPages; i++) {
      doc.setPage(i);
      doc.setFontSize(8);
      doc.text(`Página ${i} de ${totalPages}`, pageWidth - 20, pageHeight - 10);
    }
    
    // Guardar el PDF
    doc.save(`Orden_Trabajo_${this.codeExpandDialog}_Completo.pdf`);
  }
  
  // Verificar si necesitamos agregar una nueva página
  private checkAndAddPage(doc: jsPDF, currentY: number, requiredSpace: number) {
    const pageHeight = doc.internal.pageSize.getHeight();
    if (currentY + requiredSpace > pageHeight - 20) {
      doc.addPage();
      return 20; // Retornar nueva posición Y después de agregar página
    }
    return currentY;
  }
  
  // Método para agregar una tabla al documento
  private addTableToDocument(doc: jsPDF, title: string, data: any[], headers: any[], y: number): number {
    // Agregar título de sección
    this.addSectionTitle(doc, title, y);
    y += 7;
    
    // Preparar cabeceras y datos para la tabla
    const tableHeaders = headers.map(col => col.header);
    const tableData = data.map(item => 
      headers.map(col => {
        // Transformar el valor según el campo
        if (col.field.includes('fecha') && item[col.field]) {
          return this.datePipe.transform(item[col.field], 'dd/MM/yyyy') || 'N/A';
        }
        return item[col.field] !== undefined && item[col.field] !== null ? item[col.field].toString() : 'N/A';
      })
    );
    
    // Agregar la tabla al PDF
    autoTable(doc, {
      head: [tableHeaders],
      body: tableData,
      startY: y,
      theme: 'grid',
      styles: {
        fontSize: 8,
        cellPadding: 2
      },
      headStyles: {
        fillColor: [66, 139, 202],
        textColor: 255
      },
      // Configuración para manejar texto largo
      columnStyles: {
        0: {cellWidth: 'auto'}, // Primera columna con ancho automático
        // Añadir más estilos específicos para columnas si es necesario
      },
    });
    
    // Usar aserción de tipo para acceder a lastAutoTable
    return (doc as jsPDFWithAutoTable).lastAutoTable.finalY;
  }
  // Método para agregar un título de sección
  private addSectionTitle(doc: jsPDF, title: string, y: number) {
    doc.setFontSize(12);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(0, 102, 204);
    doc.text(title, 10, y);
    doc.setTextColor(0);
    doc.setDrawColor(0, 102, 204);
    doc.line(10, y + 1, 200, y + 1);
  }
  
  // Método para agregar una tabla de clave-valor
  private addKeyValueTable(doc: jsPDF, data: {key: string, value: string}[], y: number) {
    const startY = y;
    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    
    data.forEach((item, index) => {
      const rowY = startY + (index * 5);
      doc.setFont('helvetica', 'bold');
      doc.text(item.key + ':', 15, rowY);
      doc.setFont('helvetica', 'normal');
      doc.text(item.value, 60, rowY);
    });
  }
}
