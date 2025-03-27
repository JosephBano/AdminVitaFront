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
  templateUrl: './formulario-persona.component.html'
})
export class FormularioPersonaComponent implements OnInit {
  @Input() initialData: any; // Para pasar datos iniciales si es necesario
  @Input() modo: 'persona' | 'mecanico' | 'proveedor' | 'cliente' | 'usuario'= 'persona'; // O cualquier lógica que necesites
  @Output() formSubmitted = new EventEmitter<any>(); // Emitimos los datos al padre
  
  form_persona!: FormGroup;
  
  tipoPersona: any[] = []
  generosPersona: any[] = []
  booleanRadio: any[] = []

  validarExistePersona: boolean = true; //false para funcionar

  iconValidarDocumento: string = 'pi pi-search';

  constructor(
    private validacionService: ValidacionService,
    private toastr: ToastrService,
  ) { }

  ngOnInit(): void {
    this.inicializateFormGroups();
    this.radioButtonInitData();
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
      { name: 'Empresa', key: 'E' },
      { name: 'Extranjero', key: 'EX' },
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
    this.iconValidarDocumento = ''
    const tipoDocumento = identificarDocumento(this.form_persona.get('documento')?.value);
    const documento = this.form_persona.get('documento')?.value;
    if( tipoDocumento === 'invalido'){
      this.form_persona.reset();
      this.iconValidarDocumento = 'pi pi-search';
      return;
    }
    console.log(this.form_persona.get('tipoPersona')?.value);
    this.validacionService.validarPersonaXDoc(documento).subscribe({
      next: (response) => {
        console.log(response);
        if(response && 'idPersona' in response){          
          this.form_persona.patchValue({
            tipoPersona: { name: 'Natural', key: 'N' },
            nombre: response.nombre,
            apellido: response.apellido,
            razonSocial: response.razonSocial,
            email: response.email,
            celular: response.celular,
            telefono: response.telefono,
            direccion: response.direccion,
          });
          this.iconValidarDocumento = 'pi pi-check';
          console.log(this.form_persona.get('tipoPersona')?.value);
        }
        else{
          this.toastr.warning(response.mensaje, "No se pudo validar!");
          this.form_persona.get('doc_proveedor')?.setValue('');
          this.form_persona.patchValue({id_proveedor: null});;
          this.iconValidarDocumento = 'pi pi-search';
        }
      },
      error: (err) => {
        this.form_persona.get('doc_proveedor')?.setValue('');
        this.iconValidarDocumento = 'pi pi-search';
        this.toastr.warning(err.error.mensaje, "Persona no encontrada!");
      }
    })
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
function identificarDocumento(documento: string): 'cedula' | 'ruc' | 'pasaporte' | 'invalido' {
  const limpio = documento.trim();

  if (/^\d{10}$/.test(limpio) && validarCedula(limpio)) {
    return 'cedula';
  }

  if (/^\d{13}$/.test(limpio)) {
    const baseCedula = limpio.substring(0, 10);
    const ultimosTres = limpio.substring(10);
    // Verificamos si es un RUC de persona natural (cédula válida + 001)
    if (validarCedula(baseCedula) && ultimosTres === '001') {
      return 'ruc';
    }
    // Otras reglas para RUC de sociedades privadas y públicas:
    const tercerDigito = parseInt(limpio[2], 10);
    if (tercerDigito === 6 || tercerDigito === 9) {
      return 'ruc'; // Instituciones públicas (6) o jurídicas privadas (9)
    }
  }

  if (/^[a-zA-Z0-9]{5,15}$/.test(limpio)) {
    return 'pasaporte';
  }

  return 'invalido';
}

