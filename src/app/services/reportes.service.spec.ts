import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { ReportesService } from './reportes.service';
import { environment } from '../../environments/environment';

describe('ReportesService', () => {
    let service: ReportesService;
    let httpMock: HttpTestingController;

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [HttpClientTestingModule],
            providers: [ReportesService]
        });
        service = TestBed.inject(ReportesService);
        httpMock = TestBed.inject(HttpTestingController);
    });

    afterEach(() => httpMock.verify());

    it('should fetch reporte with fechaInicio and fechaFin query params', () => {
        const clienteId = 1;
        const fechaInicio = '2025-01-01';
        const fechaFin = '2025-11-10';
        const mock = { clienteId, cliente: { nombre: 'Juan', identificacion: '1234567890' }, cuentas: [] } as any;

        service.getReporteEstadoCuenta(clienteId, fechaInicio, fechaFin).subscribe(data => {
            expect(data.clienteId).toBe(clienteId);
        });

        const req = httpMock.expectOne(`${environment.apiUrl}/reportes/1?fechaInicio=${encodeURIComponent(fechaInicio)}&fechaFin=${encodeURIComponent(fechaFin)}`);
        expect(req.request.method).toBe('GET');
        req.flush(mock);
    });

    it('should download pdf with params', () => {
        const clienteId = 1;
        const fechaInicio = '2025-01-01';
        const fechaFin = '2025-11-10';
        const mock = { fileName: 'reporte.pdf', fileBase64: 'JVBERi0xLjQKJcfs...' } as any;

        service.downloadReportePdf(clienteId, fechaInicio, fechaFin).subscribe(blob => {
            expect(blob).toBeTruthy();
        });

        const req = httpMock.expectOne(`${environment.apiUrl}/reportes/1/pdf?fechaInicio=${encodeURIComponent(fechaInicio)}&fechaFin=${encodeURIComponent(fechaFin)}`);
        expect(req.request.method).toBe('GET');
        req.flush(mock, { status: 200, statusText: 'OK' });
    });
});