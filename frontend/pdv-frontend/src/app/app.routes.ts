import { Routes } from '@angular/router';
import { GestionProductosComponent } from './pages/gestion-productos/gestion-productos.component';
import { VentasComponent } from './pages/ventas/ventas.component';


export const routes: Routes = [
  { path: 'productos', component: GestionProductosComponent },
  { path: 'ventas', component: VentasComponent },
  { path: '', redirectTo: 'productos', pathMatch: 'full' },
];