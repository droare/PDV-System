import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ProductoService, Producto } from '../../services/producto.service';

@Component({
  selector: 'app-gestion-productos',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './gestion-productos.component.html',
  styleUrls: ['./gestion-productos.component.css']
})
export class GestionProductosComponent implements OnInit {
  productos: Producto[] = [];
  producto: Partial<Producto> = {};
  editando: Producto | null = null;
  error = '';
  success = '';
  loading = false;
  mostrarFormulario = false; // Nueva variable para controlar la visibilidad del formulario
  busqueda = '';

  constructor(private productoService: ProductoService, private cdr: ChangeDetectorRef) {}

  ngOnInit() {
    this.cargarProductos();
  }

  cargarProductos() {
    this.loading = true;
    this.productoService.getProductos().subscribe({
      next: data => { this.productos = data; this.loading = false; },
      error: err => { this.error = 'Error al cargar productos'; this.loading = false; }
    });
  }

  guardarProducto() {
    if (this.editando) {
      this.productoService.actualizarProducto({ ...this.editando, ...this.producto } as Producto).subscribe({
        next: () => {
          this.success = 'Producto actualizado correctamente';
          this.error = '';
          this.cancelar(true);
          this.cargarProductos();
          this.cdr.detectChanges(); // Forzar refresco inmediato
          setTimeout(() => { this.success = ''; this.cdr.detectChanges(); }, 2000);
        },
        error: () => { this.error = 'Error al actualizar'; this.cdr.detectChanges(); }
      });
    } else {
      this.productoService.agregarProducto(this.producto as Omit<Producto, 'id'>).subscribe({
        next: () => {
          this.success = 'Producto agregado correctamente';
          this.error = '';
          this.cancelar(true);
          this.cargarProductos();
          this.cdr.detectChanges(); // Forzar refresco inmediato
          setTimeout(() => { this.success = ''; this.cdr.detectChanges(); }, 2000);
        },
        error: () => { this.error = 'Error al crear'; this.cdr.detectChanges(); }
      });
    }
  }

  editarProducto(prod: Producto) {
    this.editando = prod;
    this.producto = { ...prod };
  }

  eliminarProducto(id: number) {
    if (confirm('¿Seguro que deseas eliminar este producto?')) {
      this.productoService.eliminarProducto(id).subscribe({
        next: () => {
          this.success = 'Producto eliminado correctamente';
          this.cargarProductos();
          this.cdr.detectChanges(); // Forzar refresco inmediato
          setTimeout(() => { this.success = ''; this.cdr.detectChanges(); }, 2000);
        },
        error: () => { this.error = 'Error al eliminar'; this.cdr.detectChanges(); }
      });
    }
  }

  cancelar(forceReset: boolean = false) {
    this.editando = null;
    // Forzar nuevo objeto para asegurar refresco visual
    this.producto = forceReset ? {} : {
      nombre: '',
      descripcion: '',
      stock: undefined,
      precioCompra: undefined,
      precioVenta: undefined,
      categoriaId: undefined
    };
    this.error = '';
    // No limpiar success aquí para que el mensaje se muestre después de agregar
  }

  mostrarAgregar() {
    this.mostrarFormulario = true;
    this.cancelar(true); // Limpiar formulario al abrir
  }

  ocultarFormulario() {
    this.mostrarFormulario = false;
    this.cancelar(true); // Limpiar al cerrar
  }

  get productosFiltrados() {
    const filtro = this.busqueda.trim().toLowerCase();
    if (!filtro) return this.productos;
    return this.productos.filter(p =>
      (p.nombre && p.nombre.toLowerCase().includes(filtro)) ||
      (p.descripcion && p.descripcion.toLowerCase().includes(filtro))
    );
  }
}