import { Component, OnInit } from '@angular/core';
import { VehiculoService } from '../../services/vehiculo.service';
import { VehicleDetalleResponse, VehiculosList } from '../../../../domain/response/Vehiculo.model';
import { AddVehicleInstitucional, UpdateOptionsVehicle } from '../../../../domain/request/Vehiculo.model';
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
import { Licencia } from '../../../../domain/response/Licencia.model';
import { LicenciaService } from '../../services/licencia.service';
import { MultiSelectModule } from 'primeng/multiselect';
import { DividerModule } from 'primeng/divider';
import { FileUpload } from 'primeng/fileupload';
import { SkeletonSimpleComponent } from '../../shared/components/skeleton-simple.component';

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
    FloatLabel,
    SelectModule,
    DatePickerModule,
    DropdownModule,
    SkeletonModule,
    ProgressSpinnerModule,
    TagModule,
    MultiSelectModule,
    DividerModule,
    FileUpload,
    SkeletonSimpleComponent,
  ],
  standalone: true,
  templateUrl: './vehiculo.component.html',
  styleUrl: './vehiculo.component.scss'
})
export class VehiculoComponent implements OnInit{
  
  vehiculos: VehiculosList[] = [];
  cols!: Column[];

  loading: boolean = true;
  loadingEditDialog: boolean = false;

  visibleAdd: boolean = false;
  visibleEdit: boolean = false;

  fb_addVehiculo!: FormGroup;
  fb_editVehiculo!: FormGroup;

  placaEditDialog: string='';
  VehicleEditDialog!: VehicleDetalleResponse;

  estado!: genericT[];
  tiposVehiculo!: genericT[];
  licencia!: Licencia[];

  selectedEstadoFilter!: genericT;
  selectedYearRTVFilter!: number;
  nowDate!: Date;
  minDate!: Date;

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
    this.nowDate.setFullYear(this.nowDate.getFullYear()+1);
    this.minDate = new Date(2015, 0, 1);
    this.VehicleEditDialog = {
      idVehiculo: 0,
      marca: '',
      modelo: '',
      version: '',
      placa: '',
      anio: 0,
      color: '',
      numeroChasis: '',
      numeroVehiculo: '',
      estado: 0,
      ultimoAnioMatriculacion: 0,
      ultimoAnioRTV: 0,
      tipoVehiculo: '',
      propietario: {
        idCliente: 0,
        nombre: '',
        apellidos: '',
      },
      licencias: []
    }
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
      placa: new FormControl<string | null>(null, [Validators.required, Validators.pattern(/^[A-Za-z]{3}-\d{4}$/)]),
      num_chasis: new FormControl<string | null>(null),
      tipoVehiculo: new FormControl<number | null>(null, [Validators.required]),
      licencia: new FormControl<Licencia[] | null>(null, [Validators.required]),
      numeroVehiculo: new FormControl<number | null>(null, [Validators.required, Validators.max(1000)]),
      marca: new FormControl<string | null>(null, [Validators.required]),
      modelo: new FormControl<string | null>(null),
      version: new FormControl<string | null>(null),
      color: new FormControl<string | null>(null),
      anio: new FormControl<number | null>(null, [Validators.required]),
      ultimoAnioRTV: new FormControl<number | null>(null, [Validators.required]),
      ultimoAnioMatriculacion: new FormControl<number | null>(null, [Validators.required]),
      num_documento: new FormControl<string | null>(null, [Validators.required, Validators.minLength(10), Validators.maxLength(16)]),
      propietarioId: new FormControl<number | null>(null, [Validators.required])
    })
    this.fb_editVehiculo = new FormGroup({
      estado: new FormControl<number | null>(null, [Validators.required]),
      ultimoAnioRTV: new FormControl<number | null>(null, [Validators.required]),
      ultimoAnioMatriculacion: new FormControl<number | null>(null, [Validators.required]),
    });
    this.fb_addVehiculo.get('num_documento')?.valueChanges.subscribe(() => {
      this.fb_addVehiculo.patchValue({propietarioId: null});;
      this.iconValidarDocumento = 'pi pi-search';
    });
  }
  convertFormToVehicle(): AddVehicleInstitucional {
    return {
      numeroChasis: this.fb_addVehiculo.get('num_chasis')?.value,
      placa: this.fb_addVehiculo.get('placa')?.value,
      idTipoVehiculo: this.fb_addVehiculo.get('tipoVehiculo')?.value,
      idLicencias: this.fb_addVehiculo.get('licencia')?.value,
      numeroVehiculo: this.fb_addVehiculo.get('numeroVehiculo')?.value,
      marca: this.fb_addVehiculo.get('marca')?.value,
      modelo: this.fb_addVehiculo.get('modelo')?.value,
      version: this.fb_addVehiculo.get('version')?.value,
      color: this.fb_addVehiculo.get('color')?.value,
      anio: this.fb_addVehiculo.get('anio')?.value,
      estado: 0,
      ultimoAnioRTV: this.fb_addVehiculo.get('ultimoAnioRTV')?.value,
      ultimoAnioMatriculacion: this.fb_addVehiculo.get('ultimoAnioMatriculacion')?.value,
      idCliente: this.fb_addVehiculo.get('propietarioId')?.value,
      archivos: this.uploadedFiles
    };
  }
  createVehicle() {
    const vehicle: AddVehicleInstitucional = this.convertFormToVehicle();
    this.vehiculoService.postVehicleInstitucional(vehicle).subscribe({
      next: (response: any) => {
        this.toastr.success('Vehículo creado correctamente', 'Éxito!');
        this.visibleAdd = false;
        this.ngOnInit();
      },
      error: (err) => {
        console.error("Error al crear vehículo: ", err);
        this.toastr.error('Hubo un error al crear el vehículo', 'Error!');
      }
    })
  }
  updateVehicleOptions(){
    const vehicle: UpdateOptionsVehicle = {
      idVehiculo: this.VehicleEditDialog.idVehiculo,
      estado: this.fb_editVehiculo.get('estado')?.value,
      ultimoAnioRTV: this.fb_editVehiculo.get('ultimoAnioRTV')?.value.getFullYear(),
      ultimoAnioMatriculacion: this.fb_editVehiculo.get('ultimoAnioMatriculacion')?.value.getFullYear()
    }

    this.vehiculoService.putVehicleInstitucionalOptions(vehicle).subscribe({
      next: (response: any) => {
        this.toastr.success('Opciones del vehículo actualizadas correctamente', 'Éxito!');
        this.visibleEdit = false;
        this.ngOnInit();
      },
      error: (err) => {
        this.toastr.error('Hubo un error al actualizar las opciones del vehículo', 'Error!');
      }
    })
  }
  onSelectAddFilesVehicle(event:any) {
    for(let file of event.files) {
        this.uploadedFiles.push(file);
    }
  }
  OnExportButton(){

  }
  showDialogAdd() {
    this.visibleAdd = true;
  } 
  showDialogEdit(placa: string) {
    this.visibleEdit = true;
    this.loadingEditDialog = true;
    this.vehiculoService.getVehiculoByPlaca(placa).subscribe({
      next: (response: any) => {
        this.VehicleEditDialog = response;
        this.placaEditDialog = placa;
        this.fb_editVehiculo.patchValue({
          estado: response.estado,
          ultimoAnioRTV: new Date(`${response.ultimoAnioRTV}-01-01`),
          ultimoAnioMatriculacion: new Date(`${response.ultimoAnioMatriculacion}-01-01`)
        });
        this.loadingEditDialog = false;
      },
      error: (err) => {
        console.error("Error al obtener vehículo: ", err);
        this.toastr.error('Hubo un error al obtener el vehículo', 'Error!');
        this.loadingEditDialog = false;
        this.visibleEdit = false;
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
    const year = this.nowDate.getFullYear()-1;
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
          this.fb_addVehiculo.patchValue({propietarioId: response.idPersona});
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
}
