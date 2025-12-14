import { Component, OnInit, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators, FormsModule } from '@angular/forms';
import { CuentasService } from '../../services/cuentas.service';
import { Cuenta, CreateCuentaRequest } from '../../models/cuenta.model';
import { Cliente } from '../../models/cliente.model';
import { ClientesService } from '../../services/clientes.service';

@Component({
  selector: 'app-cuentas',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule],
  templateUrl: './cuentas.component.html',
  styleUrls: ['./cuentas.component.css']
})
export class CuentasComponent implements OnInit {
  cuentas = signal<Cuenta[]>([]);
  form: FormGroup;
  showForm = signal(false);
  editing = signal<Cuenta | undefined>(undefined);
  search = signal('');
  loading = signal(false);
  errorMessage = signal('');
  loadingClientes = signal(false);

  clientes = signal<Cliente[]>([]);

  filtered = computed(() => {
    const q = this.search().toLowerCase().trim();
    if (!q) return this.cuentas();
    return this.cuentas().filter((c) => c.numeroCuenta.toLowerCase().includes(q));
  });

  constructor(private fb: FormBuilder,
    private cuentasService: CuentasService,
    private clientesService: ClientesService) {
    this.form = this.fb.group({
      tipoCuenta: ['AHORROS', Validators.required],
      saldoInicial: [0, Validators.required],
      clienteId: [null, Validators.required],
      estado: ['']
    });
  }

  ngOnInit(): void {
    this.load();
    this.loadClientes();
  }

  load(): void {
    this.loading.set(true);
    this.errorMessage.set('');
    this.cuentas.set([]);
    this.cuentasService.getCuentas().subscribe({
      next: (data) => {
        this.cuentas.set(data || []);
        this.loading.set(false);
      },
      error: (err) => {
        this.errorMessage.set(err.message || 'Error al cargar cuentas');
        this.loading.set(false);
      }
    });
  }

  loadClientes(): void {
    this.loadingClientes.set(true);
    this.clientes.set([]);

    this.clientesService.getClientes().subscribe({
      next: (data) => {
        this.clientes.set(data ?? []);
        this.loadingClientes.set(false);
      },
      error: (err) => {
        this.errorMessage.set(err.message || 'Error al cargar clientes');
        this.loadingClientes.set(false);
      }
    });
  }

  toggleForm(): void {
    this.showForm.update(v => !v);
    if (!this.showForm()) {
      this.form.reset({ tipoCuenta: 'AHORROS' });
      this.editing.set(undefined);
      this.errorMessage.set('');
    }
  }

  submit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    this.loading.set(true);
    this.errorMessage.set('');
    const formValue = this.form.value;
    const payload: CreateCuentaRequest = {
      tipoCuenta: formValue.tipoCuenta,
      saldoInicial: formValue.saldoInicial,
      clienteId: formValue.clienteId
    };

    const editingId = this.editing()?.cuentaId;
    if (editingId) {
      this.cuentasService.updateCuentaEstado(editingId, formValue.estado).subscribe({
        next: () => {
          this.load();
          this.toggleForm();
        },
        error: (err) => {
          this.errorMessage.set(err.message || 'Error al actualizar cuenta');
          this.loading.set(false);
        }
      });
    } else {
      this.cuentasService.createCuenta(payload).subscribe({
        next: () => {
          this.load();
          this.toggleForm();
        },
        error: (err) => {
          this.errorMessage.set(err.message || 'Error al crear cuenta');
          this.loading.set(false);
        }
      });
    }
  }

  edit(c: Cuenta): void {
    this.editing.set(c);
    this.form.patchValue({
      numeroCuenta: c.numeroCuenta,
      tipoCuenta: c.tipoCuenta,
      saldoInicial: c.saldoInicial,
      clienteId: c.clienteId,
      estado: c.estado
    });
    this.showForm.set(true);
  }

  remove(c: Cuenta): void {
    if (!confirm('¿Eliminar esta cuenta?')) return;
    this.loading.set(true);
    this.errorMessage.set('');
    this.cuentasService.deleteCuenta(c.cuentaId).subscribe({
      next: () => {
        this.load();
      },
      error: (err) => {
        this.errorMessage.set(err.message || 'Error al eliminar cuenta');
        this.loading.set(false);
      }
    });
  }

  cancel(): void {
    this.showForm.set(false);
    this.form.reset({ tipoCuenta: 'AHORROS' });
    this.editing.set(undefined);
    this.errorMessage.set('');
  }
}
