import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AppTopbarMec } from '../../layout/component/app.topbarMec';
import { AppFooter } from './app.footer';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-themed-layout',
  standalone: true,
  imports: [CommonModule, AppTopbarMec, AppFooter, RouterOutlet],
  template: `
  <div class="themed-layout-wrapper" [class.dark-theme]="isDarkMode">
  <app-topbarMec [isDarkMode]="isDarkMode" (themeToggled)="onThemeToggle($event)"></app-topbarMec>
  <div class="layout-main-container">
      <div class="layout-main">
          <!-- Añadir ng-content aquí para proyectar el contenido hijo -->
          <ng-content></ng-content>
          <!-- El router-outlet es para navegación, no para proyección de contenido -->
          <router-outlet></router-outlet>
      </div>
      <app-footer [isDarkMode]="isDarkMode"></app-footer>
  </div>
</div>
`,
styles: [`
    .themed-layout-wrapper {
      position: relative;
      min-height: 100vh;
    }
    
    .theme-toggle-wrapper {
      position: fixed;
      bottom: 20px;
      right: 20px;
      z-index: 9999; /* Aumentado el z-index */
      background-color: rgba(243,245,246,255);
      padding: 8px;
      border-radius: 50%;
      box-shadow: 0 2px 10px rgba(0,0,0,0.2); /* Sombra para destacar el botón */
    }
    
    .content-area {
      padding-top: 70px;
    }
    
    .dark-theme {
      background-color: #000c23;
      color: white;
    }
  `]
})
export class ThemedLayoutComponent {
    @Input() isDarkMode = false;
    @Output() themeChanged = new EventEmitter<boolean>();
    
    onThemeToggle(isDark: boolean) {
      this.isDarkMode = isDark;
      this.themeChanged.emit(isDark);
      if (isDark) {
        document.documentElement.classList.add('app-dark');
      } else {
        document.documentElement.classList.remove('app-dark');
      }
    }
  }