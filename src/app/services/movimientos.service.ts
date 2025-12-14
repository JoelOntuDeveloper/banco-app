import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Movimiento, CreateMovimientoRequest } from '../models/movimiento.model';
import { environment } from '../../environments/environment';

@Injectable({ providedIn: 'root' })
export class MovimientosService {
    private apiUrl = `${environment.apiUrl}/movimientos`;

    constructor(private http: HttpClient) { }

    /**
     * GET /api/movimientos
     * Obtiene todos los movimientos
     */
    getMovimientos(): Observable<Movimiento[]> {
        return this.http.get<Movimiento[]>(this.apiUrl).pipe(
            catchError(err => {
                console.error('Error al obtener movimientos:', err);
                return throwError(() => new Error('Error al obtener movimientos'));
            })
        );
    }

    /**
     * GET /api/movimientos/{id}
     * Obtiene un movimiento por ID
     */
    getMovimientoById(id: number): Observable<Movimiento> {
        return this.http.get<Movimiento>(`${this.apiUrl}/${id}`).pipe(
            catchError(err => {
                console.error(`Error al obtener movimiento ${id}:`, err);
                return throwError(() => new Error('Movimiento no encontrado'));
            })
        );
    }

    /**
     * GET /api/movimientos/cuenta/{cuentaId}
     * Obtiene movimientos por cuenta
     */
    getMovimientosByCuenta(cuentaId: number): Observable<Movimiento[]> {
        return this.http.get<Movimiento[]>(`${this.apiUrl}/cuenta/${cuentaId}`).pipe(
            catchError(err => {
                console.error(`Error al obtener movimientos de cuenta ${cuentaId}:`, err);
                return throwError(() => new Error('Error al obtener movimientos'));
            })
        );
    }

    /**
     * GET /api/movimientos/cliente/{clienteId}
     * Obtiene movimientos por cliente
     */
    getMovimientosByCliente(clienteId: number): Observable<Movimiento[]> {
        return this.http.get<Movimiento[]>(`${this.apiUrl}/cliente/${clienteId}`).pipe(
            catchError(err => {
                console.error(`Error al obtener movimientos del cliente ${clienteId}:`, err);
                return throwError(() => new Error('Error al obtener movimientos'));
            })
        );
    }

    /**
     * POST /api/movimientos/cuenta/{numeroCuenta}
     * Registra un depósito o retiro
     */
    createMovimiento(numeroCuenta: string, payload: CreateMovimientoRequest): Observable<Movimiento> {
        return this.http.post<Movimiento>(`${this.apiUrl}/cuenta/${numeroCuenta}`, payload).pipe(
            catchError(err => {
                console.error('Error al crear movimiento:', err);
                return throwError(() => new Error(err?.error?.message || 'Error al crear movimiento'));
            })
        );
    }
}
