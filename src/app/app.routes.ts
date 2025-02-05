import { Routes } from '@angular/router';
import { LoginComponent } from './views/auth/login/login.component';
import { HomeComponent } from './views/pages/home/home.component';
import { AppLayout } from './layout/component/app.layout';

export const appRoutes: Routes = [
    {
        path: '',
        redirectTo: 'auth',
        pathMatch: 'full'
    },
    {
        path: 'auth',
        component: LoginComponent
    },
    {
        path: 'home',
        component: AppLayout,
        children: [
            {path: '', component: HomeComponent},
        ]
    }
];
