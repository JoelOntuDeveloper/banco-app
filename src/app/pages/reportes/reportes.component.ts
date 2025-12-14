import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ReportesService } from '../../services/reportes.service';
import { ReporteEstadoCuenta } from '../../models/reporte.model';
import { ClientesService } from '../../services/clientes.service';
import { Cliente } from '../../models/cliente.model';

@Component({
  selector: 'app-reportes',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './reportes.component.html',
  styleUrls: ['./reportes.component.css']
})
export class ReportesComponent implements OnInit {

  reporte = signal<ReporteEstadoCuenta | null>(null);
  loadingClientes = signal(false);
  loadingReporte = signal(false);
  loadingPdf = signal(false);
  errorMessage = signal('');

  clienteId?: number;
  fechaInicio = '';
  fechaFin = '';

  clientes = signal<Cliente[]>([]);
  selectedCliente = signal<{ nombre: string; identificacion: string } | undefined>(undefined);

  constructor(
    private reportesService: ReportesService,
    private clientesService: ClientesService
  ) { }

  ngOnInit(): void {
    this.loadClientes();
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

  loadReporte(): void {
    if (!this.clienteId) {
      this.errorMessage.set('Selecciona un cliente');
      return;
    }

    if (!this.fechaInicio || !this.fechaFin) {
      this.errorMessage.set('Selecciona fecha inicio y fecha fin');
      return;
    }

    this.loadingReporte.set(true);
    this.errorMessage.set('');
    this.reporte.set(null);

    this.reportesService
      .getReporteEstadoCuenta(this.clienteId, this.fechaInicio, this.fechaFin)
      .subscribe({
        next: (data) => {
          this.reporte.set(data);
          this.loadingReporte.set(false);
        },
        error: (err) => {
          this.errorMessage.set(err.message || 'Error al cargar reporte');
          this.loadingReporte.set(false);
        }
      });
  }

  onClienteChange(clienteId: number | undefined): void {
    if (!clienteId) {
      this.selectedCliente.set(undefined);
      return;
    }

    const cliente = this.clientes().find(c => c.clienteId === clienteId);
    this.selectedCliente.set(cliente?.persona);
  }

  downloadPdf(): void {
    if (!this.clienteId) {
      this.errorMessage.set('Selecciona un cliente');
      return;
    }

    if (!this.fechaInicio || !this.fechaFin) {
      this.errorMessage.set('Selecciona fecha inicio y fecha fin');
      return;
    }

    this.loadingPdf.set(true);
    this.errorMessage.set('');

    this.reportesService
      .downloadReportePdf(this.clienteId, this.fechaInicio, this.fechaFin)
      .subscribe({
        next: (file) => {
          const blob = this.base64ToBlob(
            file.base64Content,
            file.fileType
          );

          const url = window.URL.createObjectURL(blob);
          const a = document.createElement('a');
          a.href = url;
          a.download = file.fileName;
          a.click();

          window.URL.revokeObjectURL(url);
          this.loadingPdf.set(false);
        },
        error: (err) => {
          this.errorMessage.set(err.message || 'Error al descargar PDF');
          this.loadingPdf.set(false);
        }
      });
  }


  private base64ToBlob(base64: string, contentType: string): Blob {
    const byteCharacters = atob(base64);
    const byteNumbers = new Array(byteCharacters.length);

    for (let i = 0; i < byteCharacters.length; i++) {
      byteNumbers[i] = byteCharacters.charCodeAt(i);
    }

    const byteArray = new Uint8Array(byteNumbers);
    return new Blob([byteArray], { type: contentType });
  }

}
