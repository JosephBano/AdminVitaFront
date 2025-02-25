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

  constructor(
    private otService: OrdenTrabajoService,
    private auth: AuthService,
    private mecService: MecanicoService,  
    private validacionService: ValidacionService,
    private toastr: ToastrService,
    private tareaService: TareasService,
    private repuestoService: RepuestoService,
    private solicitudService: SolicitudService
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
}
