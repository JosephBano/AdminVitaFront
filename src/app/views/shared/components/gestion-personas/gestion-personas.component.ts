import { CommonModule } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { Button } from 'primeng/button';
import { DropdownModule } from 'primeng/dropdown';
import { IconField } from 'primeng/iconfield';
import { InputIcon } from 'primeng/inputicon';
import { InputText } from 'primeng/inputtext';
import { SelectModule } from 'primeng/select';
import { TableModule } from 'primeng/table';
import { TagModule } from 'primeng/tag';
import { Column, HeadersTablesPersons } from '../../../shared/util/tables';
import { UsuarioService } from '../../../services/usuario.service';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { CrearPersonaComponent } from "./crear-persona/crear-persona.component";
import { SharedService } from '../service/shared.service';

@Component({
  selector: 'app-gestion-personas',
  imports: [
    TableModule,
    CommonModule,
    InputText,
    Button,
    IconField,
    InputIcon,
    TagModule,
    SelectModule,
    DropdownModule,
    CrearPersonaComponent
],
  standalone: true,
  templateUrl: './gestion-personas.component.html',
  styleUrl: './gestion-personas.component.scss'
})
export class GestionPersonasComponent implements OnInit{
  
  @Input() persona: any;
  cols: Column[] = [];
  personas: any[] = [];
  loading: boolean = true;

  visibleDialogAdd: boolean = false;
  visibleDialogEdit: boolean = false;
  visibleDialogDisable: boolean = false;
  
  constructor(
    private usuarioService: UsuarioService,
    private router: Router,
    private toastr: ToastrService,
    private sharedService: SharedService,
  ) {}
  ngOnInit(): void {
    this.initData();
    this.sharedService.estado$.subscribe(valor => {
      this.visibleDialogAdd = valor;
    });
  }
  initData() {
    this.cols = HeadersTablesPersons.PersonasList;
    switch (this.persona.key) {
      case 'user':
        this.usuarioService.getUsuarios().subscribe({
          next: (response) => {
            this.personas = response;
            this.loading = false;
          },
          error: (error) => {
            this.router.navigate(['/NotFound404']);
            this.toastr.error('Error', 'Error al cargar los usuarios');
            this.loading = false;
          }
        });
        break;
    }
  }
  showDialogAdd() {
    this.sharedService.cambiarEstado(true);
  }
  showDialogEdit(code:string){

  }
  showDialogDisable(code:string){

  }
  getFullName(code:string) {
    const persona = this.personas.find((p) => p.codigo === code);
    return persona.apellidos ? `${persona.nombre} ${persona.apellidos}` : persona.nombre;
  }
  filterGlobal(event: Event, dt: any) { //filtro para barra de busqueda
    const inputValue = (event.target as HTMLInputElement)?.value || '';
    dt.filterGlobal(inputValue, 'contains');
  }
  clear(table: any) {
    table.clear();
  }
}
