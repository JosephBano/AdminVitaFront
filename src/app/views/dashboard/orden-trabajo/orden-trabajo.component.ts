import { CommonModule, NgFor } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { TableModule } from 'primeng/table';
import { OrdenTrabajoService } from '../../services/orden-trabajo.service';
import { ORDENES } from './ordenes';

@Component({
  selector: 'app-orden-trabajo',
  imports: [
    CommonModule,
    TableModule,
    NgFor
  ],
  templateUrl: './orden-trabajo.component.html',
  styleUrl: './orden-trabajo.component.scss'
})
export class OrdenTrabajoComponent implements OnInit {

  ordenes!: any[];

  constructor(private otservice: OrdenTrabajoService) {}

  ngOnInit() {
    this.ordenes = ORDENES;
    console.log(this.ordenes);
    
  }

  
}
