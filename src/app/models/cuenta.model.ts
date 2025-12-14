export interface Cuenta {
    cuentaId: number;
    numeroCuenta: string;
    tipoCuenta: 'AHORROS' | 'CORRIENTE';
    saldoInicial: number;
    estado: 'ACTIVA' | 'BLOQUEADA' | 'INACTIVA';
    clienteId: number;
}

export interface CreateCuentaRequest {
    tipoCuenta: 'AHORROS' | 'CORRIENTE';
    saldoInicial: number;
    clienteId: number;
}

export interface UpdateCuentaStatusRequest {
    estado: 'ACTIVA' | 'BLOQUEADA' | 'INACTIVA';
}