import { Routes } from '@angular/router';
import { LoginComponent } from './views/auth/login/login.component';

export const routes: Routes = [
    {
        path: '',
        redirectTo: 'auth',
        pathMatch: 'full'
    },
    {
        path: 'auth',
        component: LoginComponent
    }
];
