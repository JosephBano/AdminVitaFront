import { Injectable, signal, computed, effect } from '@angular/core';
import { Subject } from 'rxjs';

export interface LayoutConfig {
  preset?: string;
  primary?: string;
  surface?: string | undefined | null;
  darkTheme?: boolean;
  menuMode?: string;
}

interface LayoutState {
  staticMenuDesktopInactive?: boolean;
  overlayMenuActive?: boolean;
  configSidebarVisible?: boolean;
  staticMenuMobileActive?: boolean;
  menuHoverActive?: boolean;
}

interface MenuChangeEvent {
  key: string;
  routeEvent?: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class ThemeService {
  _config: LayoutConfig = {
    preset: 'Aura',
    primary: 'emerald',
    surface: null,
    darkTheme: false,
    menuMode: 'static'
  };

  _state: LayoutState = {
    staticMenuDesktopInactive: false,
    overlayMenuActive: false,
    configSidebarVisible: false,
    staticMenuMobileActive: false,
    menuHoverActive: false
  };

  layoutConfig = signal<LayoutConfig>(this._config);
  layoutState = signal<LayoutState>(this._state);
  
  theme = computed(() => (this.layoutConfig()?.darkTheme ? 'dark' : 'light'));
  isDarkTheme = computed(() => this.layoutConfig().darkTheme);

  constructor() {
    // Initialize theme based on user preference or stored setting
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) {
      this.layoutConfig.update(config => ({ ...config, darkTheme: savedTheme === 'dark' }));
    } else {
      // Or check system preference
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      this.layoutConfig.update(config => ({ ...config, darkTheme: prefersDark }));
    }

    // Apply theme on initialization
    this.toggleDarkMode();

    // Setup effect to handle theme changes
    effect(() => {
      const config = this.layoutConfig();
      if (config) {
        this.toggleDarkMode(config);
        // Save theme preference
        localStorage.setItem('theme', config.darkTheme ? 'dark' : 'light');
      }
    });
  }

  toggleDarkMode(config?: LayoutConfig): void {
    const _config = config || this.layoutConfig();
    if (_config.darkTheme) {
      document.documentElement.classList.add('app-dark');
    } else {
      document.documentElement.classList.remove('app-dark');
    }
  }
}