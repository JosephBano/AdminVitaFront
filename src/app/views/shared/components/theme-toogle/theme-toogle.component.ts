import { Component, computed, inject, Output, EventEmitter } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { ThemeService } from '../../../services/theme.service';

@Component({
  selector: 'app-theme-toggle',
  standalone: true,
  imports: [ButtonModule],
  templateUrl: './theme-toogle.component.html',
  styleUrls: ['./theme-toogle.component.scss']
})
export class ThemeToggleComponent {
  themeService = inject(ThemeService);
  isDarkTheme = computed(() => this.themeService.layoutConfig().darkTheme);
  
  // Añadir Output para comunicar con el componente padre
  @Output() themeChanged = new EventEmitter<boolean>();
  
  toggleDarkMode() {
    // Actualizar el estado del tema
    this.themeService.layoutConfig.update((state) => ({
      ...state,
      darkTheme: !state.darkTheme
    }));
    
    // Emitir el nuevo valor para el componente padre
    this.themeChanged.emit(this.isDarkTheme());
  }
}