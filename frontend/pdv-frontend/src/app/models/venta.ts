import { Producto } from './producto';

export interface VentaProducto {
  producto: Producto;
  cantidad: number; // Puede ser unidades o gramos
  subtotal: number;
}

export interface Venta {
  id?: number;
  fecha: Date;
  productos: VentaProducto[];
  total: number;
}
