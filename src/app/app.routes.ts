import { Routes } from '@angular/router';
import { LoginComponent } from './views/auth/login/login.component';
import { AppLayout } from './layout/component/app.layout';
import { HomeComponent } from './views/dashboard/home/home.component';
import { OrdenTrabajoComponent } from './views/dashboard/orden-trabajo/orden-trabajo.component';

export const appRoutes: Routes = [
    {   path: '', component: LoginComponent },
    {   path: 'panel', component: AppLayout,
        children: [
            { path: '', component: HomeComponent},
            { path: 'OrdenTrabajo', component: OrdenTrabajoComponent}
        ]},
    {   path: '**', redirectTo: '', pathMatch: 'full'   },
];
