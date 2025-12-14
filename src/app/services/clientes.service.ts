import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Cliente, CreateClienteRequest, UpdateClienteRequest } from '../models/cliente.model';
import { environment } from '../../environments/environment';

@Injectable({ providedIn: 'root' })
export class ClientesService {
    private apiUrl = `${environment.apiUrl}/clientes`;

    constructor(private http: HttpClient) { }

    getClientes(): Observable<Cliente[]> {
        return this.http.get<Cliente[]>(this.apiUrl).pipe(
            catchError(err => {
                console.error('Error al obtener clientes:', err);
                return throwError(() => new Error('Error al obtener clientes'));
            })
        );
    }

    getClienteById(id: number): Observable<Cliente> {
        return this.http.get<Cliente>(`${this.apiUrl}/${id}`).pipe(
            catchError(err => {
                console.error(`Error al obtener cliente ${id}:`, err);
                return throwError(() => new Error(`Cliente no encontrado`));
            })
        );
    }

    getClienteByIdentificacion(identificacion: string): Observable<Cliente> {
        return this.http.get<Cliente>(`${this.apiUrl}/identificacion/${identificacion}`).pipe(
            catchError(err => {
                console.error(`Error al obtener cliente por identificación ${identificacion}:`, err);
                return throwError(() => new Error('Cliente no encontrado'));
            })
        );
    }

    createCliente(payload: CreateClienteRequest): Observable<Cliente> {
        return this.http.post<Cliente>(this.apiUrl, payload).pipe(
            catchError(err => {
                console.error('Error al crear cliente:', err);
                return throwError(() => new Error(err?.error?.message || 'Error al crear cliente'));
            })
        );
    }

    updateCliente(id: number, payload: UpdateClienteRequest): Observable<Cliente> {
        return this.http.put<Cliente>(`${this.apiUrl}/${id}`, payload).pipe(
            catchError(err => {
                console.error(`Error al actualizar cliente ${id}:`, err);
                return throwError(() => new Error(err?.error?.message || 'Error al actualizar cliente'));
            })
        );
    }

    deleteCliente(id: number): Observable<void> {
        return this.http.delete<void>(`${this.apiUrl}/${id}`).pipe(
            catchError(err => {
                console.error(`Error al eliminar cliente ${id}:`, err);
                return throwError(() => new Error(err?.error?.message || 'Error al eliminar cliente'));
            })
        );
    }
}
