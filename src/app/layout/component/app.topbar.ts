import { Component } from '@angular/core';
import { MenuItem } from 'primeng/api';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { StyleClassModule } from 'primeng/styleclass';
import { LayoutService } from '../service/layout.service';

@Component({
    selector: 'app-topbar',
    standalone: true,
    imports: [RouterModule, CommonModule, StyleClassModule],
    template: ` <div class="layout-topbar">
        <div class="layout-topbar-logo-container">
            <button class="layout-menu-button layout-topbar-action" (click)="layoutService.onMenuToggle()">
                <i class="pi pi-bars"></i>
            </button>
            <a class="layout-topbar-logo" routerLink="/">
            <svg fill="#C4A857" width="800px" height="800px" viewBox="0 0 14 14" role="img" focusable="false" aria-hidden="true" xmlns="http://www.w3.org/2000/svg">
                <path style="fill-rule:evenodd" d="m 2.2,9.396449 0,1.79793 C 2.2,11.533988 2.4683489,11.8 2.799374,11.8 l 0.601252,0 C 3.7344038,11.8 4,11.528854 4,11.194379 L 4,10.6 l 6,0 0,0.594379 C 10,11.533988 10.268349,11.8 10.599374,11.8 l 0.601252,0 C 11.534404,11.8 11.8,11.528854 11.8,11.194379 L 11.8,9.4 c -2e-6,-0.0012 0,-1.8 0,-1.8 l 0.604918,0 C 12.726816,7.6 13,7.331371 13,7 13,6.666319 12.733573,6.4 12.404918,6.4 L 11.8,6.4 9.4,2.2 4.6,2.2 2.2,6.4 1.5950819,6.4 C 1.2731833,6.4 1,6.668629 1,7 1,7.333681 1.2664272,7.6 1.5950819,7.6 L 2.2,7.6 2.2,9.396449 Z M 10.514286,6.4 8.8,3.4 l -3.6,0 -1.7142857,3 7.0285717,0 0,0 z M 4.3,9.4 C 4.7970563,9.4 5.2,8.997056 5.2,8.5 5.2,8.002944 4.7970563,7.6 4.3,7.6 3.8029437,7.6 3.4,8.002944 3.4,8.5 c 0,0.497056 0.4029437,0.9 0.9,0.9 l 0,0 z m 5.4,0 c 0.497056,0 0.9,-0.402944 0.9,-0.9 0,-0.497056 -0.402944,-0.9 -0.9,-0.9 -0.4970562,0 -0.9,0.402944 -0.9,0.9 0,0.497056 0.4029438,0.9 0.9,0.9 l 0,0 z"/></svg>
                <span>VITA</span>
            </a>
        </div>

        <div class="layout-topbar-actions">
            <div class="layout-config-menu">
                <button type="button" class="layout-topbar-action">
                    <i class="pi pi-inbox"></i>
                    <span>Messages</span>
                </button>
                <button type="button" class="layout-topbar-action">
                    <i class="pi pi-user"></i>
                    <span>Profile</span>
                </button>
            </div>
        </div>
    </div>`
})
export class AppTopbar {
    items!: MenuItem[];

    constructor(public layoutService: LayoutService) {}
}
