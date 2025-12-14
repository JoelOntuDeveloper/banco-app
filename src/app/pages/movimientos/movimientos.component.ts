import { Component, OnInit, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators, FormsModule } from '@angular/forms';
import { MovimientosService } from '../../services/movimientos.service';
import { Movimiento, CreateMovimientoRequest } from '../../models/movimiento.model';

@Component({
  selector: 'app-movimientos',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule],
  templateUrl: './movimientos.component.html',
  styleUrls: ['./movimientos.component.css']
})
export class MovimientosComponent implements OnInit {
  movimientos = signal<Movimiento[]>([]);
  form: FormGroup;
  showForm = signal(false);
  search = signal('');
  loading = signal(false);
  errorMessage = signal('');

  filtered = computed(() => {
    const q = this.search().toLowerCase().trim();
    if (!q) return this.movimientos();
    return this.movimientos().filter(
      (m) =>
        String(m.cuentaId).includes(q) ||
        m.numeroCuenta.toLowerCase().includes(q) ||
        m.tipoMovimiento.toLowerCase().includes(q)
    );
  });

  constructor(private fb: FormBuilder, private movimientosService: MovimientosService) {
    this.form = this.fb.group({
      numeroCuenta: [null, Validators.required],
      valor: [0, [Validators.required]]
    });
  }

  ngOnInit(): void {
    this.load();
  }

  load(): void {
    this.loading.set(true);
    this.errorMessage.set('');
    this.movimientos.set([]);
    this.movimientosService.getMovimientos().subscribe({
      next: (data) => {
        this.movimientos.set(data || []);
        this.loading.set(false);
      },
      error: (err) => {
        this.errorMessage.set(err.message || 'Error al cargar movimientos');
        this.loading.set(false);
      }
    });
  }

  toggleForm(): void {
    this.showForm.update(v => !v);
    if (!this.showForm()) {
      this.form.reset({ tipoMovimiento: 'DEPOSITO' });
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
    const numeroCuenta = formValue.numeroCuenta;
    const payload: CreateMovimientoRequest = {
      numeroCuenta: numeroCuenta,
      tipoMovimiento: formValue.tipoMovimiento,
      valor: formValue.valor
    };

    this.movimientosService.createMovimiento(numeroCuenta, payload).subscribe({
      next: () => {
        this.load();
        this.toggleForm();
      },
      error: (err) => {
        this.errorMessage.set(err.message || 'Error al crear movimiento');
        this.loading.set(false);
      }
    });
  }

  cancel(): void {
    this.showForm.set(false);
    this.form.reset({ tipoMovimiento: 'DEPOSITO' });
    this.errorMessage.set('');
  }
}
