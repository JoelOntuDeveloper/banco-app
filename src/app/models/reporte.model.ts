export interface ReporteEstadoCuenta {
    clienteId: number;
    cliente: {
        nombre: string;
        identificacion: string;
    };
    cuentas: Array<{
        cuentaId: number;
        numeroCuenta: string;
        tipoCuenta: string;
        saldoActual: number;
        movimientos: Array<{
            movimientoId: number;
            fecha: string;
            tipoMovimiento: string;
            valor: number;
            saldoDespues: number;
        }>;
    }>;
}