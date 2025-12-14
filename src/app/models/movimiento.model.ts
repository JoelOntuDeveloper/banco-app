export interface Movimiento {
    movimientoId: number;
    fecha: string; // ISO 8601
    tipoMovimiento: 'DEPOSITO' | 'RETIRO';
    valor: number;
    saldo: number;
    cuentaId: number;
    numeroCuenta: string;
}

export interface CreateMovimientoRequest {
    numeroCuenta: string;
    tipoMovimiento: 'DEPOSITO' | 'RETIRO';
    valor: number;
}