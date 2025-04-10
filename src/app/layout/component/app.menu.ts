import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router'; 
import { MenuItem } from 'primeng/api';
import { AppMenuitem } from './app.menuitem';

@Component({
    selector: 'app-menu',
    standalone: true,
    imports: [CommonModule, AppMenuitem, RouterModule],
    template: `<ul class="layout-menu">
        <ng-container *ngFor="let item of model; let i = index">
            <li app-menuitem *ngIf="!item.separator" [item]="item" [index]="i" [root]="true"></li>
            <li *ngIf="item.separator" class="menu-separator"></li>
        </ng-container>
    </ul> `
})
export class AppMenu {
    model: MenuItem[] = [];
    ngOnInit() {
        this.model = [
            {
                items: [{ label: 'Inicio', icon: 'pi pi-fw pi-home', routerLink: ['/panel']}]
            },
            {
                label: 'Orden de Trabajo',
                items: [
                    { label: 'Listado Ordenes de Trabajo', icon: 'pi pi-fw pi-id-card', routerLink: ['/panel/OrdenTrabajo'] }
                ]
            },
            {
                label: 'Vehiculos',
                items: [
                    { label: 'Inventario Vehicular', icon: 'pi pi-fw pi-car', routerLink: ['/panel/Vehiculos'] }
                ]
            },
            {
                label: 'Inventario',
                items: [
                    { label: 'Inventario de Items', icon: 'pi pi-fw pi-box', routerLink: ['/panel/Inventario'] }
                ]
            },
            {
                label: 'Adquisiciones',
                items: [
                    { 
                        label: 'Sistema de Adquisiciones', 
                        icon: 'pi pi-fw pi-shopping-cart',
                        items: [
                            {label: 'Listado Adquisiciones', routerLink: ['/panel/Adquisiciones']},
                            {label: 'Agregar Adquisiciones', routerLink: ['/panel/Adquisiciones/agregar']}
                        ]
                    },
                ]
            },
            {
                label: 'Personas',
                items: [
                    { label: 'Gestión Administrativo', icon: 'pi pi-fw pi-user', routerLink: ['/panel/persons/Usuario'] },
                    { label: 'Gestión Mecánico', icon: 'pi pi-fw pi-wrench', routerLink: ['/panel/persons/Mecanico'] },
                    { label: 'Gestión Proveedor', icon: 'pi pi-fw pi-box', routerLink: ['/panel/persons/Proveedor'] },
                ]
            }
        ];
    }
}
