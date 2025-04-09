import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LayoutService } from '../service/layout.service';

@Component({
    standalone: true,
    imports : [CommonModule],
    selector: 'app-footer',
    template: `<div class="layout-footer" [ngClass]="{'dark-footer': isDarkMode}">
    VITA by Instituto Superior Tecnológico Mayor Pedro Traversarí
    </div>`,
    styles: [`
        .dark-footer {
            color:rgb(223, 232, 230) !important; 
        }
    `]
})
export class AppFooter {
    private _isDarkMode = false;
    @Input() 
    set isDarkMode(value: boolean) {
        this._isDarkMode = value; 
    }
    get isDarkMode(): boolean {
        return this._isDarkMode; 
    }
}