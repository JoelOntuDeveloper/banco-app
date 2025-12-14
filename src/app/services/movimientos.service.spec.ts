import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { MovimientosService } from './movimientos.service';
import { environment } from '../../environments/environment';

describe('MovimientosService', () => {
    let service: MovimientosService;
    let httpMock: HttpTestingController;

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [HttpClientTestingModule],
            providers: [MovimientosService]
        });
        service = TestBed.inject(MovimientosService);
        httpMock = TestBed.inject(HttpTestingController);
    });

    afterEach(() => httpMock.verify());

    it('should fetch movimientos list', () => {
        const mock = [{ movimientoId: 1, cuentaId: 1, numeroCuenta: '478758', tipoMovimiento: 'DEPOSITO', valor: 10, saldo: 110, fecha: '2025-01-01' }];

        service.getMovimientos().subscribe(data => {
            expect(data.length).toBe(1);
            expect(data[0].numeroCuenta).toBe('478758');
        });

        const req = httpMock.expectOne(`${environment.apiUrl}/movimientos`);
        expect(req.request.method).toBe('GET');
        req.flush(mock);
    });

    it('should create movimiento POST to correct url', () => {
        const payload = { cuentaId: 1, tipoMovimiento: 'DEPOSITO', valor: 25 } as any;
        const created = { movimientoId: 2, cuentaId: 1, numeroCuenta: '478758', tipoMovimiento: 'DEPOSITO', valor: 25, saldo: 135, fecha: '2025-01-02' } as any;

        service.createMovimiento('478758', payload).subscribe(data => {
            expect(data.movimientoId).toBe(2);
            expect(data.valor).toBe(25);
        });

        const req = httpMock.expectOne(`${environment.apiUrl}/movimientos/cuenta/478758`);
        expect(req.request.method).toBe('POST');
        expect(req.request.body).toEqual(payload);
        req.flush(created);
    });
});