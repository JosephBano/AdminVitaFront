import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
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
    DividerModule
  ],
  standalone: true,
  templateUrl: './agregar-adquisicion.component.html',
  styleUrl: './agregar-adquisicion.component.scss'
})
export class AgregarAdquisicionComponent implements OnInit {

  magnitudes!: any[];
  items: Item[] = [];
  selectedItem!: Item;

  detalleCols: any;
  detallesCompra: any[] = [];
  detallesCompraPeticion: any[] = [];

  fb_adquisicion!: FormGroup;
  fb_detalleAdquisicion!: FormGroup;

  uploadedFile: any[] = [];
  
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

  constructor(
    private validacionService: ValidacionService,
    private toastr: ToastrService,
    private itemService: ItemService,
    private magnitudService: MagnitudService,
  ) { }
  ngOnInit(): void {
    this.detalleCols = HeadersTables.DetalleFacturaList;
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
      valorUnitario: new FormControl<string | null>({value: null, disabled: true}),
      id_magnitud: new FormControl<number | null>(null),
    });
    this.fb_adquisicion.get('doc_proveedor')?.valueChanges.subscribe(() => {
      this.fb_adquisicion.patchValue({id_proveedor: null});;
      this.iconValidarDocumento = 'pi pi-search';
    });
    this.getData();
    this.detalleCompraHandler();
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
  }
  validarDocumentoProveedor() {
    this.iconValidarDocumento = ''
    const numDocumento = this.fb_adquisicion.get('doc_proveedor')?.value;
    this.validacionService.validarProveedorXDoc(numDocumento).subscribe({
      next: (response) => {
        if('idPersona' in response){
          this.fb_adquisicion.patchValue({id_proveedor: response.idPersona});
          console.log(response);
          
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
  addDetalleCompra(){
    if(this.fb_detalleAdquisicion.invalid){
      this.toastr.error('Todos los campos son obligatorios!', 'Error');
      return;
    }
    if(this.fb_detalleAdquisicion.get('codigo')?.value){
      const item = this.detallesCompra.find(item => item.codigo === this.fb_detalleAdquisicion.get('codigo')?.value);
      if(item){
        this.toastr.error('El item ya ha sido agregado!', 'Error');
        return;
      }
    }
    const detalleCompraPeticion = {
      idDetalleCompra: 0,
      idCompra: 0, //Cambiar al momento de guardar
      idItem: this.selectedItem.idItem,
      idMagnitud: this.fb_detalleAdquisicion.get('id_magnitud')?.value ?? 0,
      cantidad: this.fb_detalleAdquisicion.get('cantidad')?.value,
      valorUnitario: this.selectedItem.valorUnitario,
    };
    const detalleCompra = {
      codigo: this.selectedItem.codigo,
      description: this.selectedItem.nombre + ' - ' + this.selectedItem.descripcion,
      magnitud: this.magnitudes.find(magnitud => magnitud.idMagnitud === detalleCompraPeticion.idMagnitud)?.nombre,
      cantidad: this.fb_detalleAdquisicion.get('cantidad')?.value,
      valorUnitario: this.selectedItem.valorUnitario,
      subtotal: detalleCompraPeticion.cantidad * this.selectedItem.valorUnitario,
    }
    this.detallesCompraPeticion.push(detalleCompraPeticion);
    this.detallesCompra.push(detalleCompra);
    this.detalleCompraHandler();  
    this.fb_detalleAdquisicion.reset();
    this.toastr.success('Detalle agregado correctamente!', 'Exito');
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
    this.fb_detalleAdquisicion.get('codigo')?.setValue(this.selectedItem.codigo);
    
    this.fb_detalleAdquisicion.patchValue({
      nombre: this.selectedItem.nombre,
      valorUnitario: this.selectedItem.valorUnitario,
    })
  }
  detalleCompraHandler() {
    this.subtotal = this.detallesCompra.reduce((acc, item) => acc + item.subtotal, 0);
    this.total = this.subtotal + (this.subtotal * this.iva) - this.descuento;
  }
}
