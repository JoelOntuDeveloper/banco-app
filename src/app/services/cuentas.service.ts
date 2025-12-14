import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Cuenta, CreateCuentaRequest, UpdateCuentaStatusRequest } from '../models/cuenta.model';
import { environment } from '../../environments/environment';

@Injectable({ providedIn: 'root' })
export class CuentasService {
    private apiUrl = `${environment.apiUrl}/cuentas`;

    constructor(private http: HttpClient) { }

    getCuentas(): Observable<Cuenta[]> {
        return this.http.get<Cuenta[]>(this.apiUrl).pipe(
            catchError(err => {
                console.error('Error al obtener cuentas:', err);
                return throwError(() => new Error('Error al obtener cuentas'));
            })
        );
    }

    getCuentaById(id: number): Observable<Cuenta> {
        return this.http.get<Cuenta>(`${this.apiUrl}/${id}`).pipe(
            catchError(err => {
                console.error(`Error al obtener cuenta ${id}:`, err);
                return throwError(() => new Error('Cuenta no encontrada'));
            })
        );
    }

    getCuentaByNumero(numeroCuenta: string): Observable<Cuenta> {
        return this.http.get<Cuenta>(`${this.apiUrl}/numero/${numeroCuenta}`).pipe(
            catchError(err => {
                console.error(`Error al obtener cuenta ${numeroCuenta}:`, err);
                return throwError(() => new Error('Cuenta no encontrada'));
            })
        );
    }

    getCuentasByCliente(clienteId: number): Observable<Cuenta[]> {
        return this.http.get<Cuenta[]>(`${this.apiUrl}/cliente/${clienteId}`).pipe(
            catchError(err => {
                console.error(`Error al obtener cuentas del cliente ${clienteId}:`, err);
                return throwError(() => new Error('Error al obtener cuentas'));
            })
        );
    }

    getSaldoCuenta(id: number): Observable<number> {
        return this.http.get<number>(`${this.apiUrl}/${id}/saldo`).pipe(
            catchError(err => {
                console.error(`Error al obtener saldo de cuenta ${id}:`, err);
                return throwError(() => new Error('Error al obtener saldo'));
            })
        );
    }

    createCuenta(payload: CreateCuentaRequest): Observable<Cuenta> {
        return this.http.post<Cuenta>(this.apiUrl, payload).pipe(
            catchError(err => {
                console.error('Error al crear cuenta:', err);
                return throwError(() => new Error(err?.error?.message || 'Error al crear cuenta'));
            })
        );
    }

    updateCuentaEstado(id: number, estado: 'ACTIVA' | 'BLOQUEADA' | 'INACTIVA'): Observable<Cuenta> {
        return this.http.patch<Cuenta>(`${this.apiUrl}/${id}/estado`, {}, { params: { estado } }).pipe(
            catchError(err => {
                console.error(`Error al actualizar estado de cuenta ${id}:`, err);
                return throwError(() => new Error(err?.error?.message || 'Error al actualizar cuenta'));
            })
        );
    }

    deleteCuenta(id: number): Observable<void> {
        return this.http.delete<void>(`${this.apiUrl}/${id}`).pipe(
            catchError(err => {
                console.error(`Error al eliminar cuenta ${id}:`, err);
                return throwError(() => new Error(err?.error?.message || 'Error al eliminar cuenta'));
            })
        );
    }
}
