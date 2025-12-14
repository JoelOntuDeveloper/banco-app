import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { CuentasService } from './cuentas.service';
import { environment } from '../../environments/environment';

describe('CuentasService', () => {
    let service: CuentasService;
    let httpMock: HttpTestingController;

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [HttpClientTestingModule],
            providers: [CuentasService]
        });
        service = TestBed.inject(CuentasService);
        httpMock = TestBed.inject(HttpTestingController);
    });

    afterEach(() => httpMock.verify());

    it('should fetch cuentas list', () => {
        const mock = [{ cuentaId: 1, numeroCuenta: '478758', tipoCuenta: 'AHORROS', saldoInicial: 100, clienteId: 1, estado: 'ACTIVA' }];

        service.getCuentas().subscribe(data => {
            expect(data.length).toBe(1);
            expect(data[0].numeroCuenta).toBe('478758');
        });

        const req = httpMock.expectOne(`${environment.apiUrl}/cuentas`);
        expect(req.request.method).toBe('GET');
        req.flush(mock);
    });

    it('should create cuenta', () => {
        const payload = { numeroCuenta: '225487', tipoCuenta: 'AHORROS', saldoInicial: 50, clienteId: 1 } as any;
        const created = { cuentaId: 2, ...payload, estado: 'ACTIVA' } as any;

        service.createCuenta(payload).subscribe(data => {
            expect(data.cuentaId).toBe(2);
            expect(data.numeroCuenta).toBe('225487');
        });

        const req = httpMock.expectOne(`${environment.apiUrl}/cuentas`);
        expect(req.request.method).toBe('POST');
        expect(req.request.body).toEqual(payload);
        req.flush(created);
    });
});