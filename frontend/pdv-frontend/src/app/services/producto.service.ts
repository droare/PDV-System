import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Producto {
  id: number;
  nombre: string;
  descripcion: string;
  stock: number;
  precioCompra: number;
  precioVenta: number;
  categoriaId?: number;
}

@Injectable({
  providedIn: 'root'
})
export class ProductoService {
  private apiUrl = 'http://localhost:8081/api/productos';

  constructor(private http: HttpClient) {}

  getProductos(): Observable<Producto[]> {
    return this.http.get<Producto[]>(this.apiUrl);
  }

  getProducto(id: number): Observable<Producto> {
    return this.http.get<Producto>(`${this.apiUrl}/${id}`);
  }

  agregarProducto(producto: Omit<Producto, 'id'>): Observable<Producto> {
    // Si categoriaId es null o undefined, no lo enviamos
    const productoToSend: any = { ...producto };
    if (productoToSend.categoriaId == null) {
      delete productoToSend.categoriaId;
    }
    return this.http.post<Producto>(this.apiUrl, productoToSend);
  }

  actualizarProducto(producto: Producto): Observable<Producto> {
    return this.http.put<Producto>(`${this.apiUrl}/${producto.id}`, producto);
  }

  eliminarProducto(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
