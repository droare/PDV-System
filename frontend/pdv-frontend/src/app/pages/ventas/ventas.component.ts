import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Producto } from '../../models/producto';
import { Venta, VentaProducto } from '../../models/venta';
import { ProductoService } from '../../services/producto.service';

@Component({
  selector: 'app-ventas',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './ventas.component.html',
  styleUrls: ['./ventas.component.css']
})
export class VentasComponent {
  productos: Producto[] = [];
  productosVenta: VentaProducto[] = [];
  busqueda = '';
  cantidad = 1;
  productoSeleccionado?: Producto;
  total = 0;

  constructor(private productoService: ProductoService) {
    this.cargarProductos();
  }

  cargarProductos() {
    this.productoService.getProductos().subscribe({
      next: data => this.productos = data,
      error: () => {}
    });
  }

  agregarProducto() {
    if (!this.productoSeleccionado || this.cantidad <= 0) return;
    const subtotal = this.cantidad * (this.productoSeleccionado.precioVenta || 0);
    this.productosVenta.push({
      producto: this.productoSeleccionado,
      cantidad: this.cantidad,
      subtotal
    });
    this.calcularTotal();
    this.productoSeleccionado = undefined;
    this.cantidad = 1;
  }

  quitarProducto(index: number) {
    this.productosVenta.splice(index, 1);
    this.calcularTotal();
  }

  calcularTotal() {
    this.total = this.productosVenta.reduce((sum, p) => sum + p.subtotal, 0);
  }

  registrarVenta() {
    // Aquí se podría enviar la venta al backend
    this.productosVenta = [];
    this.total = 0;
  }
}
