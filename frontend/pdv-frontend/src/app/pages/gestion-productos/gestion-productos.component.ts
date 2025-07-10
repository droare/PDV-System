import { Component, OnInit, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ProductoService } from '../../services/producto.service';
import { Producto } from '../../models/producto';
import { Router, NavigationEnd } from '@angular/router';
import { filter, Subscription } from 'rxjs';

@Component({
  selector: 'app-gestion-productos',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './gestion-productos.component.html',
  styleUrls: ['./gestion-productos.component.css']
})
export class GestionProductosComponent implements OnInit, OnDestroy {
  productos: Producto[] = [];
  producto: Partial<Producto> = {};
  editando: Producto | null = null;
  error = '';
  success = '';
  loading = false;
  mostrarFormulario = false; // Nueva variable para controlar la visibilidad del formulario
  busqueda = '';

  private routerSub?: Subscription;

  constructor(
    private productoService: ProductoService,
    private cdr: ChangeDetectorRef,
    private router: Router
  ) {}

  ngOnInit() {
    this.cargarProductos();
    this.routerSub = this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe(event => {
      if (this.router.url.startsWith('/productos')) {
        this.cargarProductos();
      }
    });
  }

  ngOnDestroy() {
    this.routerSub?.unsubscribe();
  }

  cargarProductos() {
    this.loading = true;
    this.mostrarFormulario = false;
    this.editando = null;
    this.productoService.getProductos().subscribe({
      next: data => {
        this.productos = data;
        this.loading = false;
        this.cdr.detectChanges(); // Forzar refresco visual
      },
      error: err => {
        console.error('Error al cargar productos:', err);
        this.error = 'Error al cargar productos: ' + (err?.message || err?.statusText || '');
        this.loading = false;
        this.cdr.detectChanges(); // Forzar refresco visual
      }
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

  focusSiguienteCampo() {
    const nombreInput = document.querySelector('input[name=nombre]') as HTMLInputElement;
    if (nombreInput) nombreInput.focus();
  }
}