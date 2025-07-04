import { Routes } from '@angular/router';
import { GestionProductosComponent } from './pages/gestion-productos/gestion-productos.component';


export const routes: Routes = [
  { path: 'productos', component: GestionProductosComponent },
  { path: '', redirectTo: 'productos', pathMatch: 'full' },
];