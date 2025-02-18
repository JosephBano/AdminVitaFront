import { Component, OnInit } from '@angular/core';
import { VehiculoService } from '../../services/vehiculo.service';
import { Licencia, VehiculosList } from '../../../../domain/response/Vehiculo.model';
import { Column, HeadersTables } from '../../shared/util/tables';
import { Table, TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { CommonModule, NgFor, NgIf } from '@angular/common';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { InputTextModule } from 'primeng/inputtext';
import { FormsModule, Validators } from '@angular/forms';
import { DialogModule } from 'primeng/dialog';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { FloatLabel } from 'primeng/floatlabel';
import { SelectModule } from 'primeng/select';
import { DatePickerModule } from 'primeng/datepicker';
import { EstadosVehiculo, genericT } from '../../shared/util/genericData';
import { ToastrService } from 'ngx-toastr';
import { SkeletonModule } from 'primeng/skeleton';
import { DropdownModule } from 'primeng/dropdown';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { TagModule } from 'primeng/tag';
import { ValidacionService } from '../../services/validacion.service';
import { LicenciaList } from '../../../../domain/response/Licencia.model';
import { LicenciaService } from '../../services/licencia.service';
import { MultiSelectModule } from 'primeng/multiselect';
import { DividerModule } from 'primeng/divider';
import { FileUpload } from 'primeng/fileupload';
import { FileUploadEvent } from 'primeng/fileupload';

interface UploadEvent {
  originalEvent: Event;
  files: File[];
}

@Component({
  selector: 'app-vehiculo',
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
    DialogModule,
    FloatLabel,
    SelectModule,
    DatePickerModule,
    DropdownModule,
    SkeletonModule,
    ProgressSpinnerModule,
    TagModule,
    MultiSelectModule,
    DividerModule,
    FileUpload
  ],
  standalone: true,
  templateUrl: './vehiculo.component.html',
  styleUrl: './vehiculo.component.scss'
})
export class VehiculoComponent implements OnInit{
  
  vehiculos: VehiculosList[] = [];
  cols!: Column[];

  loading: boolean = true;
  visibleAdd: boolean = false;

  fb_addVehiculo!: FormGroup;

  estado!: genericT[];
  tiposVehiculo!: genericT[];
  licencia!: LicenciaList[];

  selectedEstadoFilter!: genericT;
  selectedYearRTVFilter!: number;
  nowDate!: Date;

uploadedFiles: any[] = [];

  iconValidarDocumento: string = 'pi pi-search';

  constructor(
    private vehiculoService: VehiculoService,
    private validacionService: ValidacionService,
    private toastr: ToastrService,
    private licenciaService: LicenciaService
  ) { }

  ngOnInit(): void {
    this.estado = EstadosVehiculo;
    this.cols = HeadersTables.VehiculosList;
    this.nowDate = new Date();
    this.tiposVehiculo = [
      {name: 'Automotor', code: 0},
      {name: 'Moto', code: 1},
      {name: 'Camioneta', code: 2},
      {name: 'Utilitario', code: 3}
    ];
    this.vehiculoService.getVehiculosInstitucionales().subscribe({
      next: (response) => {
        this.vehiculos = response;
        this.loading = false;
      },
      error: (err) => {
        console.error("Error al obtener vehículos: ", err);
        this.loading = false;
      }
    })
    this.licenciaService.getLicencias().subscribe({
      next: (response) => {
        this.licencia = response;
      },
      error: (err) => {
        console.error("Error al obtener licencias: ", err);
      }
    })
    this.fb_addVehiculo = new FormGroup({
      placa: new FormControl<string | null>(null, [Validators.required, Validators.minLength(7), Validators.maxLength(8)]),
      num_chasis: new FormControl<string | null>(null),
      tipoVehiculo: new FormControl<number | null>(null, [Validators.required]),
      estado: new FormControl<number | null>(null, [Validators.required]),
      licencia: new FormControl<Licencia[] | null>(null, [Validators.required]),
      numeroVehiculo: new FormControl<number | null>(null, [Validators.required, Validators.maxLength(5)]),
      marca: new FormControl<string | null>(null, [Validators.required]),
      modelo: new FormControl<string | null>(null),
      version: new FormControl<string | null>(null),
      color: new FormControl<string | null>(null),
      anio: new FormControl<number | null>(null, [Validators.required, Validators.min(2010), Validators.max(this.nowDate.getFullYear())]),
      ultimoAnioRTV: new FormControl<number | null>(null, [Validators.required, Validators.min(2010), Validators.max(this.nowDate.getFullYear())]),
      ultimoAnioMatriculacion: new FormControl<number | null>(null, [Validators.required, Validators.min(2010), Validators.max(this.nowDate.getFullYear())]),
      num_documento: new FormControl<string | null>(null, [Validators.required, Validators.min(1), Validators.max(1000)]),
      propietarioId: new FormControl<number | null>(null, [Validators.required])
    })
  }
  
  OnExportButton(){

  }
  showDialogAdd() {
    this.visibleAdd = true;
  } 
  filterGlobal(event: Event, dt: any) { //filtro para barra de busqueda
    const inputValue = (event.target as HTMLInputElement)?.value || '';
    dt.filterGlobal(inputValue, 'contains');
  }
  clear(table: Table) {
    table.clear();
  }
  getSeverityEstado(status: number) {
    switch (status) {
      case 0: return 'success';
      case 1: return 'warn';
      case 2: return 'danger';
      default:
        return 'secondary';
    }
  }
  GetEstado(id: number)  {
    const item = this.estado.find(x => x.code === id);  
    return item?.name;
  }
  GetSeverityYear(anio: number){
    const year = this.nowDate.getFullYear();
    if(anio == year) return 'success';
    if(anio == (year-1)) return 'warn';
    return 'danger';
  }
  validarDocumento() {
    this.iconValidarDocumento = ''
    const numDocumento = this.fb_addVehiculo.get('num_documento')?.value;
    this.validacionService.validarClienteXDoc(numDocumento).subscribe({
      next: (response) => {
        if(response.esClienteActivo){
          this.fb_addVehiculo.patchValue({clienteId: response.idPersona});
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
  onUpload(event:FileUploadEvent) {
    for(let file of event.files) {
        this.uploadedFiles.push(file);
    }
  }
}
