import { Routes } from '@angular/router';
import { LoginComponent } from './views/auth/login/login.component';
import { AppLayout } from './layout/component/app.layout';
import { HomeComponent } from './views/dashboard/home/home.component';
import { OrdenTrabajoComponent } from './views/dashboard/orden-trabajo/orden-trabajo.component';
import { VehiculoComponent } from './views/dashboard/vehiculo/vehiculo.component';
import { InventarioComponent } from './views/dashboard/inventario/inventario.component';
import { AdquisicionComponent } from './views/dashboard/adquisicion/adquisicion.component';
import { NotfoundComponent } from './views/notfound/notfound.component';

export const appRoutes: Routes = [
    {   path: '', component: LoginComponent },
    {   path: 'panel', component: AppLayout,
        children: [
            { path: '', component: HomeComponent},
            { path: 'OrdenTrabajo', component: OrdenTrabajoComponent},
            { path: 'Vehiculos', component: VehiculoComponent},
            { path: 'Inventario', component: InventarioComponent},
            { path: 'Adquisiciones', component: AdquisicionComponent}
        ]},
    {   path: 'notFound404', component: NotfoundComponent}, 
    {   path: '**', redirectTo: 'notFound404', pathMatch: 'full'   },
];
