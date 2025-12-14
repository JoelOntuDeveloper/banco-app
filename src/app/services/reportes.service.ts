import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { environment } from '../../environments/environment';
import { ReporteEstadoCuenta } from '../models/reporte.model';
import { FileBase64DTO } from '../models/file-base64.dto';

@Injectable({ providedIn: 'root' })
export class ReportesService {
    private apiUrl = `${environment.apiUrl}/reportes`;

    constructor(private http: HttpClient) { }
    getReporteEstadoCuenta(clienteId: number, fechaInicio: string, fechaFin: string): Observable<ReporteEstadoCuenta> {
        const params = `?fechaInicio=${encodeURIComponent(fechaInicio)}&fechaFin=${encodeURIComponent(fechaFin)}`;
        return this.http.get<ReporteEstadoCuenta>(`${this.apiUrl}/${clienteId}${params}`).pipe(
            catchError(err => {
                console.error(`Error al obtener reporte del cliente ${clienteId}:`, err);
                return throwError(() => new Error(err?.error?.message || 'Error al obtener reporte'));
            })
        );
    }

    downloadReportePdf(
        clienteId: number,
        fechaInicio: string,
        fechaFin: string
    ): Observable<FileBase64DTO> {

        const params = `?fechaInicio=${encodeURIComponent(fechaInicio)}&fechaFin=${encodeURIComponent(fechaFin)}`;

        return this.http.get<FileBase64DTO>(
            `${this.apiUrl}/${clienteId}/pdf${params}`
        );
    }

}
