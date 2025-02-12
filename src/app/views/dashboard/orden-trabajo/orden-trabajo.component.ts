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
import { EstadosOTs, genericT, PrioridadesOT, ExpandOptionsOT } from '../../shared/util/genericData';
import { TagModule } from 'primeng/tag';
import { SelectButtonModule } from 'primeng/selectbutton';
import { BadgeModule } from 'primeng/badge';
import { DropdownModule } from 'primeng/dropdown';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { ValidacionService } from '../../services/validacion.service';
import { ToastrService } from 'ngx-toastr';

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
  ],
  standalone: true,
  templateUrl: './orden-trabajo.component.html',
  styleUrl: './orden-trabajo.component.scss',
  encapsulation: ViewEncapsulation.None,
  
})

export class OrdenTrabajoComponent implements OnInit {

  ordenes: ordenTrabajoList[] = [];
  cols!: Column[];

  loading: boolean = true;

  visibleAdd: boolean = false;   
  visibleEdit: boolean = false;   
  visibleExpand: boolean = false;

  fb_addOt!: FormGroup;
  fb_editOt!: FormGroup;

  estado!: genericT[];
  prioridad!: genericT[];
  supervisor!: genericT[];

  selectedEstadoFilter!: genericT;
  selectedPrioridadFilter!: genericT;

  minDate: Date | undefined;

  codeEditDialog: string = '';
  codeExpandDialog: string = '';

  ExpandOptionsValue!: genericT;
  ExpandOptions!: genericT[];

  iconValidarDocumento: string = 'pi pi-search';
  iconValidarPlaca: string = 'pi pi-search';

  constructor(
    private otService: OrdenTrabajoService,
    private auth: AuthService,
    private mecService: MecanicoService,  
    private validacionService: ValidacionService,
    private toastr: ToastrService,
  ) {}

  ngOnInit() {    
    this.cols = HeadersTables.OrdenesTrabajoList;
    this.estado = EstadosOTs;
    this.prioridad = PrioridadesOT
    this.ExpandOptions = ExpandOptionsOT; 
    this.minDate = new Date();

    this.otService.getOrdenesTrabajoListado().subscribe({
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
      vehiculoId: new FormControl<number | null>(null, [Validators.requiredTrue]),
      estado: new FormControl<genericT | null>(null, [Validators.required]),
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
      if (this.fb_addOt.get('num_documento')?.invalid){

      }
    });

    this.fb_addOt.get('placa')?.valueChanges.subscribe(() => {
      this.fb_addOt.patchValue({vehiculoId: null})
      this.iconValidarPlaca = 'pi pi-search';
    })
  }

  createOT():void{
    //Contenido validacion
    this.fb_addOt.patchValue({
      ValidarDoc: true,
    })
  }

  formatDate(dateString: string): string {
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
        this.fb_editOt.get('estado')?.disable();
      }
    }) 
  }
  showDialogExpand(code: string){
    this.visibleExpand = true;
    this.codeExpandDialog = code;
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
}
