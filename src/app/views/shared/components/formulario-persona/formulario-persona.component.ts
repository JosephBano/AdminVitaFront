import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { FloatLabelModule } from 'primeng/floatlabel';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { ValidacionService } from '../../../services/validacion.service';
import { ToastrService } from 'ngx-toastr';
import { InputTextModule } from 'primeng/inputtext';
import { InputIconModule } from 'primeng/inputicon';
import { IconFieldModule } from 'primeng/iconfield';
import { DividerModule } from 'primeng/divider';
import { RadioButtonModule } from 'primeng/radiobutton';
import { DatePicker } from 'primeng/datepicker';
import { Cliente, Propietario } from '../../../../../domain/request/Cliente.model';
import { PropietarioService } from '../../../services/propietario.service';
import { response } from 'express';


@Component({
  selector: 'app-formulario-persona',
  imports: [
    CommonModule,
    ButtonModule,
    FormsModule,
    ReactiveFormsModule,
    FloatLabelModule,
    ProgressSpinnerModule,
    IconFieldModule,
    InputIconModule,
    InputTextModule,
    DividerModule,
    RadioButtonModule,
    DatePicker
  ],
  templateUrl: './formulario-persona.component.html',
})
export class FormularioPersonaComponent implements OnInit {
  @Input() initialData: any;
  @Input() personaVariante: 'persona' | 'mecanico' | 'proveedor' | 'cliente' | 'usuario' | 'propietario' = 'persona'; // O cualquier lógica que necesites
  @Output() formSubmitted = new EventEmitter<any>();
  
  form_persona!: FormGroup;
  
  tipoPersona: any[] = []
  generosPersona: any[] = []
  booleanRadio: any[] = []

  validarExistePersona: boolean = false;

  iconValidarDocumento: string = 'pi pi-search';

  constructor(
    private validacionService: ValidacionService,
    private propietarioService: PropietarioService,
    private toastr: ToastrService,
  ) { }

  ngOnInit(): void {
    this.inicializateFormGroups();
    this.radioButtonInitData();
    this.form_persona.get('documento')?.valueChanges.subscribe(() => {
      this.validarExistePersona = false;
      this.iconValidarDocumento = 'pi pi-search';
    });
  }
  inicializateFormGroups(){
    this.form_persona = new FormGroup({
      tipoPersona: new FormControl<string | null>(null, [Validators.required]),
      documento: new FormControl<string | null>(null, [Validators.required]),
      nombre: new FormControl<string | null>(null, [Validators.required, Validators.minLength(3), Validators.pattern(/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]*$/)]),
      apellidos: new FormControl<string | null>(null, [Validators.pattern(/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]*$/)]),
      email: new FormControl<string | null>(null, [Validators.required, Validators.email]),
      celular: new FormControl<string | null>(null, [Validators.required, Validators.minLength(10), Validators.maxLength(10)]),
      telefono: new FormControl<string | null>(null),
      direccion: new FormControl<string | null>(null, [Validators.required]),
      fecha_nacimiento: new FormControl<Date | null>(null),
      genero: new FormControl<string | null>(null),
      razonSocial: new FormControl<string | null>(null),
      representanteLegal: new FormControl<string | null>(null),
      obligadaContabilidad: new FormControl<boolean | null>(null),
    });
  }
  radioButtonInitData(){
    this.tipoPersona = [
      { name: 'Natural', key: 'N' },
      { name: 'Empresa', key: 'E' }
    ];
    this.generosPersona = [
      { name: 'Masculino', key: 'M' },
      { name: 'Femenino', key: 'F' },
      { name: 'Otro', key: 'O' },
    ];
    this.booleanRadio = [
      { name: 'Si', key: 1 },
      { name: 'No', key: 0 },
    ]
  }
  validarDocumento() {
    this.enabledOptions();
    this.iconValidarDocumento = ''
    const tipoDocumento = identificarDocumento(this.form_persona.get('documento')?.value);
    const documento = this.form_persona.get('documento')?.value;
    if( tipoDocumento === 'undefined'){
      this.form_persona.reset();
      this.iconValidarDocumento = 'pi pi-search';
      return;
    }
    this.validacionService.validarPersonaXDoc(documento).subscribe({
      next: (response) => {
        this.disabledOptions();
        if(response && 'idPersona' in response){       
          const tipoResponse = response.razonSocial=='' ? 'N':'E';
          const tipoSeleccionado = this.tipoPersona.find((t) => t.key === tipoResponse);
          const generoSeleccionado = this.generosPersona.find((g) => g.key === response.genero);
          
          this.form_persona.patchValue({
            tipoPersona: tipoSeleccionado,
            nombre: response.nombre,
            apellidos: response.apellidos,
            razonSocial: response.razonSocial,
            email: response.email,
            celular: response.celular,
            telefono: response.telefono,
            direccion: response.direccion,
            genero: generoSeleccionado,
            fecha_nacimiento: this.formatDate(response.fechaCumpleanios),
            representanteLegal: response.representanteLegal,
            obligadaContabilidad: response.obligadaContabilidad,
          });
          this.iconValidarDocumento = 'pi pi-check';
        }
        else{
          this.iconValidarDocumento = 'pi pi-search';
          this.enabledOptions()
          this.toastr.info('No se encontró una persona con este documento', 'Ingrese la persona');
        }
        this.validarExistePersona = true;
      },
    });
  };
  closeDialog(){
    this.form_persona.reset();
    this.formSubmitted.emit(true);
  }
  crearPersonaHandler(){
    switch(this.personaVariante){
      case 'persona':
        console.log('Persona');
        break;
      case'mecanico':
      console.log('Mecanico');
        break;
      case 'proveedor':
        console.log('Proveedor');
        break;
      case 'propietario':
        const tipoDOC = identificarDocumento(this.form_persona.get('documento')?.value)
        const nuevoCliente: Propietario = {
          nombre: this.form_persona.get('nombre')?.value,
          tipoPersona: this.form_persona.get('tipoPersona')?.value.key,
          tipoDocumento: tipoDOC == 'undefined' ? undefined:tipoDOC,
          documento: this.form_persona.get('documento')?.value,
          email: this.form_persona.get('email')?.value,
          celular: this.form_persona.get('celular')?.value,
          telefono: this.form_persona.get('telefono')?.value,
          direccion: this.form_persona.get('direccion')?.value,
          apellidos: this.form_persona.get('apellidos')?.value,
          fechaNacimiento: parseFecha(this.form_persona.get('fecha_nacimiento')?.value),
          genero: this.form_persona.get('genero')?.value.key,
          razonSocial: this.form_persona.get('razonSocial')?.value,
          representanteLegalNombre: this.form_persona.get('representanteLegal')?.value,
          obligadaContabilidad: this.form_persona.get('obligadaContabilidad')?.value,
          esLocal: false,
          idVehiculo: this.initialData
        };

        this.propietarioService.registrarPropietario(nuevoCliente).subscribe({
          next: (response) => {
            console.log(response);
            this.toastr.success('Se ha cambiado el propietario exitosamente!', 'Tarea Exitosa')
          },
          error: (err) =>{
            console.log(err);
            this.toastr.success('No se ha podido cambiar el propietario, intente mas tarde!', "Upss! Error!")
          }
        })
        break;
      case 'usuario':
        console.log('Usuario');
        break;
    }
    this.formSubmitted.emit(true);
  };

  disabledOptions(){
    this.form_persona.get('tipoPersona')?.disable();
    this.form_persona.get('nombre')?.disable();
    this.form_persona.get('apellidos')?.disable();
    this.form_persona.get('email')?.disable();
    this.form_persona.get('celular')?.disable();
    this.form_persona.get('telefono')?.disable();
    this.form_persona.get('direccion')?.disable();
    this.form_persona.get('fecha_nacimiento')?.disable();
    this.form_persona.get('genero')?.disable();
    this.form_persona.get('razonSocial')?.disable();
    this.form_persona.get('representanteLegal')?.disable();
    this.form_persona.get('obligadaContabilidad')?.disable();
  }
  enabledOptions(){
    this.form_persona.get('tipoPersona')?.enable();
    this.form_persona.get('nombre')?.enable();
    this.form_persona.get('apellidos')?.enable();
    this.form_persona.get('email')?.enable();
    this.form_persona.get('celular')?.enable();
    this.form_persona.get('telefono')?.enable();
    this.form_persona.get('direccion')?.enable();
    this.form_persona.get('fecha_nacimiento')?.enable();
    this.form_persona.get('genero')?.enable();
    this.form_persona.get('razonSocial')?.enable();
    this.form_persona.get('representanteLegal')?.enable();
    this.form_persona.get('obligadaContabilidad')?.enable();
  }
  formatDate(dateString: string): string {
    if(dateString === 'Vacío') return 'Vacío';
    const date = new Date(dateString);
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const year = date.getFullYear();
    
    return `${day}/${month}/${year}`;
  }
}
function validarCedula(cedula: string): boolean {
  if (!/^\d{10}$/.test(cedula)) return false;

  const provincia = parseInt(cedula.substring(0, 2), 10);
  if (provincia < 1 || provincia > 24) return false;

  const tercerDigito = parseInt(cedula[2], 10);
  if (tercerDigito > 5) return false;

  const coef = [2, 1, 2, 1, 2, 1, 2, 1, 2];
  const digitos = cedula.split('').map(Number);

  let suma = 0;
  for (let i = 0; i < 9; i++) {
    let mult = digitos[i] * coef[i];
    if (mult >= 10) mult -= 9;
    suma += mult;
  }

  const verificador = (10 - (suma % 10)) % 10;
  return verificador === digitos[9];
}
function identificarDocumento(documento: string): 'C' | 'R' | 'P' | 'undefined' {
  const limpio = documento.trim();

  if (/^\d{10}$/.test(limpio) && validarCedula(limpio)) {
    return 'C';
  }

  if (/^\d{13}$/.test(limpio)) {
    const baseCedula = limpio.substring(0, 10);
    const ultimosTres = limpio.substring(10);
    // Verificamos si es un RUC de persona natural (cédula válida + 001)
    if (validarCedula(baseCedula) && ultimosTres === '001') {
      return 'R';
    }
    // Otras reglas para RUC de sociedades privadas y públicas:
    const tercerDigito = parseInt(limpio[2], 10);
    if (tercerDigito === 6 || tercerDigito === 9) {
      return 'R'; // Instituciones públicas (6) o jurídicas privadas (9)
    }
  }

  if (/^[a-zA-Z0-9]{5,15}$/.test(limpio)) {
    return 'P';
  }

  return 'undefined';
}
function parseFecha(fechaStr: string): string {
  const [dia, mes, anioCorto] = fechaStr.split("/").map(Number);
  const anio = anioCorto < 100 ? 2000 + anioCorto : anioCorto;
  const fecha = new Date(anio, mes - 1, dia);
  return fecha.toISOString(); 
}

