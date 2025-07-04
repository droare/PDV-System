export interface Producto {
  id: number;
  nombre: string;
  descripcion: string;
  stock: number;
  precioCompra: number;
  precioVenta: number;
  categoriaId?: number;
}