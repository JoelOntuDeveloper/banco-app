import { Component, OnInit, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators, FormsModule } from '@angular/forms';
import { ClientesService } from '../../services/clientes.service';
import { Cliente, CreateClienteRequest, UpdateClienteRequest } from '../../models/cliente.model';

@Component({
  selector: 'app-clientes',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule],
  templateUrl: './clientes.component.html',
  styleUrls: ['./clientes.component.css']
})
export class ClientesComponent implements OnInit {
  clientes = signal<Cliente[]>([]);
  form: FormGroup;
  showForm = signal(false);
  editing = signal<Cliente | undefined>(undefined);
  search = signal('');
  loading = signal(false);
  errorMessage = signal('');

  filtered = computed(() => {
    const q = this.search().toLowerCase().trim();
    if (!q) return this.clientes();
    return this.clientes().filter(
      (c) =>
        c.persona.nombre.toLowerCase().includes(q) ||
        c.persona.identificacion.toLowerCase().includes(q)
    );
  });

  constructor(private fb: FormBuilder, private clientesService: ClientesService) {
    this.form = this.fb.group({
      nombre: ['', Validators.required],
      identificacion: ['', Validators.required],
      genero: [''],
      edad: [''],
      direccion: [''],
      telefono: [''],
      contrasena: [''],
    });
  }

  ngOnInit(): void {
    this.load();
  }

  load(): void {
    this.loading.set(true);
    this.errorMessage.set('');
    this.clientes.set([]);
    this.clientesService.getClientes().subscribe({
      next: (data) => {
        this.clientes.set(data || []);
        this.loading.set(false);
      },
      error: (err) => {
        this.errorMessage.set(err.message || 'Error al cargar clientes');
        this.loading.set(false);
      }
    });
  }


  toggleForm(): void {
    this.showForm.update(v => !v);
    if (!this.showForm()) {
      this.form.reset();
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
    const payloadCreate: CreateClienteRequest = {
      persona: {
        nombre: formValue.nombre,
        identificacion: formValue.identificacion,
        genero: formValue.genero || undefined,
        edad: formValue.edad || undefined,
        direccion: formValue.direccion || undefined,
        telefono: formValue.telefono || undefined
      },
      contrasena: formValue.contrasena
    };

    const payloadUpdate: UpdateClienteRequest = {
      persona: {
        personaId: this.editing()?.persona.personaId || 0,
        nombre: formValue.nombre,
        identificacion: formValue.identificacion,
        genero: formValue.genero || undefined,
        edad: formValue.edad || undefined,
        direccion: formValue.direccion || undefined,
        telefono: formValue.telefono || undefined
      }
    };

    const editingId = this.editing()?.clienteId;
    if (editingId) {
      this.clientesService.updateCliente(editingId, payloadUpdate).subscribe({
        next: () => {
          this.load();
          this.toggleForm();
        },
        error: (err) => {
          this.errorMessage.set(err.message || 'Error al actualizar cliente');
          this.loading.set(false);
        }
      });
    } else {
      this.clientesService.createCliente(payloadCreate).subscribe({
        next: () => {
          this.load();
          this.toggleForm();
        },
        error: (err) => {
          this.errorMessage.set(err.message || 'Error al crear cliente');
          this.loading.set(false);
        }
      });
    }
  }

  edit(c: Cliente): void {
    this.editing.set(c);
    this.form.patchValue({
      nombre: c.persona.nombre,
      identificacion: c.persona.identificacion,
      genero: c.persona.genero,
      edad: c.persona.edad,
      direccion: c.persona.direccion,
      telefono: c.persona.telefono
    });
    this.showForm.set(true);
  }

  remove(c: Cliente): void {
    if (!confirm('¿Eliminar este cliente?')) return;
    this.loading.set(true);
    this.errorMessage.set('');
    this.clientesService.deleteCliente(c.clienteId).subscribe({
      next: () => {
        this.load();
      },
      error: (err) => {
        this.errorMessage.set(err.message || 'Error al eliminar cliente');
        this.loading.set(false);
      }
    });
  }

  cancel(): void {
    this.showForm.set(false);
    this.form.reset();
    this.editing.set(undefined);
    this.errorMessage.set('');
  }
}
