import { CommonModule } from '@angular/common';
import { Component, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { FileUpload } from 'primeng/fileupload';
import { FloatLabel } from 'primeng/floatlabel';
import { InputTextModule } from 'primeng/inputtext';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { ValidacionService } from '../../../services/validacion.service';
import { ToastrService } from 'ngx-toastr';
import { DatePickerModule } from 'primeng/datepicker';
import { ItemService } from '../../../services/item.service';
import { Item } from '../../../../../domain/response/Item.model';
import { SelectModule } from 'primeng/select';
import { FloatLabelModule } from 'primeng/floatlabel';
import { InputNumberModule } from 'primeng/inputnumber';
import { HeadersTables } from '../../../shared/util/tables';
import { DetalleCompraResponse } from '../../../../../domain/response/Adquisicion.model';
import { TableModule } from 'primeng/table';
import { NgFor, NgIf } from '@angular/common';
import { ivaCalculo } from '../../../../../environments/environment.development';
import { DividerModule } from 'primeng/divider';
import { MagnitudService } from '../../../services/magnitud.service';
import { ComprasService } from '../../../services/compras.service';
import { SolicitudCrearCompra } from '../../../../../domain/response/Compra.model';
import { DetalleCompraService } from '../../../services/detalleCompra.service';
import { ActivatedRoute, Router } from '@angular/router';
import { SkeletonCompletePageComponent } from "../../../shared/components/skeleton/skeleton-complete-page.component";

@Component({
  selector: 'app-agregar-adquisicion',
  imports: [
    CommonModule,
    CardModule,
    FormsModule,
    ReactiveFormsModule,
    FileUpload,
    FloatLabel,
    InputTextModule,
    ButtonModule,
    ProgressSpinnerModule,
    DatePickerModule,
    SelectModule,
    FloatLabelModule,
    InputNumberModule,
    TableModule,
    NgFor,
    NgIf,
    DividerModule,
],
  standalone: true,
  templateUrl: './agregar-adquisicion.component.html',
  styleUrl: './agregar-adquisicion.component.scss'
})
export class AgregarAdquisicionComponent implements OnInit {

  @ViewChild('fu') fileUpload!: FileUpload;
  magnitudOrigenItem: any = null;
  magnitudes!: any[];
  items: Item[] = [];
  selectedItem!: Item;

  detalleCols: any;
  detallesCompra: any[] = [];
  detallesCompraPeticion: any[] = [];

  fb_adquisicion!: FormGroup;
  fb_detalleAdquisicion!: FormGroup;

  uploadedFile: File | null = null;
  
  resumen = {
    nombre: '',
    razonSocial: '',
    email: '',
    telefono: '',
    celular: '',
    direccion: '',
  }
  subtotal: number = 0.00;
  iva: number = ivaCalculo.IVA;
  descuento: number = 0.00;
  total: number = 0.00;

  iconValidarDocumento: string = 'pi pi-search';

  loadingEdit: boolean = false;

  loadingMagnitudes: boolean = false;
  constructor(
    private validacionService: ValidacionService,
    private toastr: ToastrService,
    private itemService: ItemService,
    private magnitudService: MagnitudService,
    private compraService: ComprasService,
    private detalleCompraService : DetalleCompraService,
    private router: Router,
    private route: ActivatedRoute
  ) { }
  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('factura');
    if(id){
      this.loadingEdit = true;
      this.compraService.getCompraDetallada(id).subscribe({
        next: (response) => {
          console.log('Compra detallada:', response);
          this.fb_adquisicion.patchValue({
            codigo: response.numeroFactura,
            doc_proveedor: response.documento,
            id_proveedor: response.idProveedor
          });
          this.validarDocumentoProveedor();
          this.detallesCompra = response.detallesCompra;
          this.loadingEdit = false;
          this.fb_adquisicion.get('codigo')?.disable();
          this.fb_adquisicion.get('doc_proveedor')?.disable();
        },
        error: (err) => {
          console.error(err);
          this.toastr.error(err.error.mensaje, 'Error al cargar la compra');
          this.router.navigate(['notFound404']);
        }
      })
    }
    this.detalleCols = HeadersTables.DetalleFacturaList; 
    this.getData();
    this.initFormGroups();
    this.detalleCompraHandler();
  }
  initFormGroups(){
    this.fb_adquisicion = new FormGroup({
      codigo: new FormControl<string | null>(null, [Validators.required, Validators.minLength(6)]),
      doc_proveedor: new FormControl<string | null>(null, [Validators.required, Validators.minLength(10), Validators.maxLength(16)]),
      id_proveedor: new FormControl<number | null>(null, [Validators.required]),
    })
    this.fb_detalleAdquisicion = new FormGroup({
      codigo: new FormControl<string | null>(null, [Validators.required]),
      nombre: new FormControl<string | null>({value: null, disabled: true}, [Validators.required]),
      detalle: new FormControl<string | null>(null),
      cantidad: new FormControl<number | null>(null, [Validators.required]),
      valorUnitario: new FormControl<string | null>({value: null, disabled: false}),
      id_magnitud: new FormControl<number | null>(null),
    });
    this.fb_adquisicion.get('doc_proveedor')?.valueChanges.subscribe(() => {
      this.fb_adquisicion.patchValue({id_proveedor: null});;
      this.iconValidarDocumento = 'pi pi-search';
    });
  }
  getData(){
    this.itemService.getItemsList().subscribe({
      next: (response) => {
        this.items = response;
      },
      error: (err) => {
        console.error(err);
      }
    })
    this.magnitudService.getMagnitudes().subscribe({
      next: (response) => {
        this.magnitudes = response;
      },
      error: (err) => {
        console.error(err);
      }
    })
  }
  onUpload(event:any) {
    this.uploadedFile = event.files[0];
    console.log('Archivo subido:', this.uploadedFile);
  }
  validarDocumentoProveedor() {
    this.iconValidarDocumento = ''
    const numDocumento = this.fb_adquisicion.get('doc_proveedor')?.value;
    this.validacionService.validarProveedorXDoc(numDocumento).subscribe({
      next: (response) => {
        if('idPersona' in response){
          this.fb_adquisicion.patchValue({id_proveedor: response.idPersona});
          this.resumen = {
            nombre: `${response.nombre}${response.apellidos!='' ? ' '+response.apellidos : ''}`,
            razonSocial: response.razonSocial,
            email: response.email,
            telefono: response.telefono,
            celular: response.celular,
            direccion: response.direccion,
          };
          this.iconValidarDocumento = 'pi pi-check';
        }
        else{
          this.toastr.warning(response.mensaje, "No se pudo validar!");
          this.fb_adquisicion.get('doc_proveedor')?.setValue('');
          this.fb_adquisicion.patchValue({id_proveedor: null});;
          this.iconValidarDocumento = 'pi pi-search';
        }
      },
      error: (err) => {
        this.fb_adquisicion.get('doc_proveedor')?.setValue('');
        this.iconValidarDocumento = 'pi pi-search';
        this.toastr.warning(err.error.mensaje, "Persona no encontrada!");
      }
    })
  }

  addDetalleCompra() {
    if (this.fb_detalleAdquisicion.invalid) {
      this.toastr.error('Todos los campos son obligatorios!', 'Error');
      return;
    }
    
    if (this.fb_detalleAdquisicion.get('codigo')?.value) {
      const item = this.detallesCompra.find(item => item.codigo === this.fb_detalleAdquisicion.get('codigo')?.value);
      if (item) {
        this.toastr.error('El item ya ha sido agregado!', 'Error');
        return;
      }
    }
  
    // Obtener valores del formulario
    // Modificado para que sea null en lugar de 0 cuando no hay valor
    const idMagnitudSeleccionada = this.fb_detalleAdquisicion.get('id_magnitud')?.value || null;
    const cantidadIngresada = this.fb_detalleAdquisicion.get('cantidad')?.value;
    
    // Verificar si necesitamos hacer conversión de unidades
    if (this.magnitudOrigenItem && idMagnitudSeleccionada && idMagnitudSeleccionada !== this.magnitudOrigenItem.idMagnitud) {
      // Si la magnitud seleccionada es diferente a la magnitud origen, hacer conversión
      this.toastr.info('Realizando conversión de unidades...', 'Procesando');
      
      this.magnitudService.convertirUnidad(
        idMagnitudSeleccionada, 
        cantidadIngresada, 
        this.magnitudOrigenItem.idMagnitud
      ).subscribe({
        next: (respuesta) => {
          console.log('Resultado de conversión:', respuesta);
          // Usar el resultado de la conversión para crear el detalle de compra
          this.crearDetalleCompra(respuesta.unidadDestino, idMagnitudSeleccionada);
        },
        error: (error) => {
          console.error('Error en la conversión de unidades:', error);
          this.toastr.error('No se pudo realizar la conversión de unidades', 'Error');
        }
      });
    } else {
      // No se necesita conversión, usar la cantidad directamente
      this.crearDetalleCompra(cantidadIngresada, idMagnitudSeleccionada);
    }
  }
  crearDetalleCompra(cantidadFinal: number, idMagnitudSeleccionada: number | null) {
    const cantidadOriginal = this.fb_detalleAdquisicion.get('cantidad')?.value;
    const valorUnitario = this.fb_detalleAdquisicion.get('valorUnitario')?.value || this.selectedItem.valorUnitario;

    const detalleCompraPeticion = {
      idDetalleCompra: null,
      idCompra: 0, 
      idItem: this.selectedItem.idItem,
      idMagnitud: idMagnitudSeleccionada, 
      cantidad: cantidadFinal, 
      cantidadBase : cantidadOriginal,
      valorUnitario: valorUnitario,
    };
    
    const detalleCompra = {
      codigo: this.selectedItem.codigo,
      description: this.selectedItem.nombre + ' - ' + this.selectedItem.descripcion,
      magnitud: idMagnitudSeleccionada ? 
        this.magnitudes.find(magnitud => magnitud.idMagnitud === idMagnitudSeleccionada)?.nombre : 
        'N/A',
      cantidad: this.fb_detalleAdquisicion.get('cantidad')?.value, 
      cantidadConvertida: cantidadFinal !== this.fb_detalleAdquisicion.get('cantidad')?.value ? 
        `(${cantidadFinal} ${this.magnitudOrigenItem?.unidad})` : '',
      cantidadBase: cantidadOriginal,
      valorUnitario: valorUnitario,
      subtotal: cantidadOriginal * valorUnitario,
    };
    
    this.detallesCompraPeticion.push(detalleCompraPeticion);
    this.detallesCompra.push(detalleCompra);
    this.detalleCompraHandler();  
    this.fb_detalleAdquisicion.reset();
    this.toastr.success('Detalle agregado correctamente!', 'Éxito');
  }
  deleteDetalleCompra(code: string){
    const index = this.detallesCompra.findIndex(item => item.codigo === code);
    this.detallesCompra.splice(index, 1);
    this.detallesCompraPeticion.splice(index, 1);
    this.detalleCompraHandler();
    this.toastr.success('Detalle eliminado correctamente!', 'Exito');
  }
  onItemChange(selectedCode: any) {
    this.selectedItem = this.items.find(item => item.codigo === selectedCode)!;
    console.log('Item seleccionado:', this.selectedItem);
    if (!this.selectedItem) return;
    
    this.fb_detalleAdquisicion.patchValue({
      codigo: this.selectedItem.codigo,
      nombre: this.selectedItem.nombre,
      valorUnitario: this.selectedItem.valorUnitario,
      id_magnitud: null
    });
    
    if (this.selectedItem.idItem) {
      this.loadingMagnitudes = true;
      this.magnitudOrigenItem = null; 
      this.magnitudService.GetMagnitudCompatibleByItem(this.selectedItem.idItem).subscribe({
        next: (response) => {
          console.log('Magnitudes disponibles:', response);
          let magnitudesDisponibles: any[] = [];
          if (response && response.magnitudOrigen) {
            this.magnitudOrigenItem = response.magnitudOrigen;
            magnitudesDisponibles.push(response.magnitudOrigen);
            if (response.magnitudesCompatibles && Array.isArray(response.magnitudesCompatibles)) {
              magnitudesDisponibles = magnitudesDisponibles.concat(response.magnitudesCompatibles);
            }
          }
          if (magnitudesDisponibles.length === 0) {
            this.toastr.info('Este ítem no requiere una magnitud', 'Información');
            this.fb_detalleAdquisicion.get('id_magnitud')?.disable();
            this.fb_detalleAdquisicion.patchValue({ id_magnitud: null });
            this.magnitudes = [];
          } else {
            this.fb_detalleAdquisicion.get('id_magnitud')?.enable();
            this.magnitudes = magnitudesDisponibles;
          }
          
          this.loadingMagnitudes = false;
        },
        error: (err) => {
          this.toastr.info('Este ítem no posee una magnitud asociada', 'Información');
          this.fb_detalleAdquisicion.get('id_magnitud')?.disable();
          this.fb_detalleAdquisicion.patchValue({ id_magnitud: null });
          this.magnitudes = [];
          this.loadingMagnitudes = false;
          this.magnitudOrigenItem = null;
        }
      });
    }
  }
  cargarTodasMagnitudes() {
  this.magnitudService.getMagnitudes().subscribe({
    next: (response) => {
      this.magnitudes = response;
    },
    error: (err) => {
      this.toastr.info('Este ítem no posee una magnitud asociada', 'Info');
    }
  });
  }
  isMagnitudDisabled(): boolean {
  const magnitudControl = this.fb_detalleAdquisicion?.get('id_magnitud');
  return magnitudControl ? magnitudControl.disabled : false;
  }
  detalleCompraHandler() {
    this.subtotal = this.detallesCompra.reduce((acc, item) => acc + item.subtotal, 0);
    this.total = this.subtotal + (this.subtotal * this.iva) - this.descuento;
  }
  onFileSelect(event: any) {
    if (event.files && event.files.length > 0) {
      this.uploadedFile = event.files[0];
      this.toastr.success('Archivo seleccionado correctamente', 'Éxito');
    }
  }
  crearCompra() {
    if (this.fb_adquisicion.invalid) {
      this.toastr.error('Por favor complete todos los campos requeridos', 'Error');
      return;
    }
    if (!this.fb_adquisicion.get('id_proveedor')?.value) {
      this.toastr.error('Debe validar el proveedor antes de continuar', 'Error');
      return;
    }
    if (this.detallesCompra.length === 0) {
      this.toastr.warning('Debe agregar al menos un detalle a la compra', 'Advertencia');
      return;
    }
    const solicitud: SolicitudCrearCompra = {
      idProveedor: this.fb_adquisicion.get('id_proveedor')?.value,
      numeroFactura: this.fb_adquisicion.get('codigo')?.value,
      archivo: this.uploadedFile
    };
    this.toastr.info('Procesando su solicitud...', 'Creando Compra');
    this.compraService.crearCompra(solicitud).subscribe({
      next: (respuestaCompra) => {
        console.log('Compra creada:', respuestaCompra);
        if (respuestaCompra && respuestaCompra.idCompra) {
          const idCompra = respuestaCompra.idCompra;
          this.detallesCompraPeticion.forEach(detalle => {
            detalle.idCompra = idCompra;
          });
          console.log('Detalles de compra a guardar:', this.detallesCompraPeticion);
          this.detalleCompraService.createUpdateDetalleCompra(this.detallesCompraPeticion).subscribe({
            next: (respuestaDetalles) => {
              console.log('Detalles de compra guardados:', respuestaDetalles);
              this.toastr.success('Compra y sus detalles creados exitosamente', 'Éxito');
              this.limpiarFormulario();
            },
            error: (errorDetalles) => {
              console.error('Error al crear los detalles de la compra', errorDetalles);
              this.toastr.error(errorDetalles.error?.mensaje || 'Error al guardar los detalles', 'Error');
            }
          });
        } else {
          this.toastr.warning('La compra se creó pero no se pudo obtener su ID', 'Advertencia');
        }
      },
      error: (errorCompra) => {
        console.error('Error al crear la compra', errorCompra);
        this.toastr.error(errorCompra.error?.mensaje || 'Error al crear la compra', 'Error');
      }
    });
  }  
  limpiarFormulario() {
    this.fb_adquisicion.reset();
    this.fb_detalleAdquisicion.reset();
    this.detallesCompra = [];
    this.detallesCompraPeticion = [];
    this.uploadedFile = null;
    if (this.fileUpload) {
      this.fileUpload.clear(); 
      console.log('FileUpload component cleared');
    } else {
      console.warn('FileUpload component not found');
    }
    this.iconValidarDocumento = 'pi pi-search';
    this.subtotal = 0.00;
    this.total = 0.00;
    this.resumen = {
      nombre: '',
      razonSocial: '',
      email: '',
      telefono: '',
      celular: '',
      direccion: '',
    };
    this.detalleCompraHandler();
  }
}
