import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { ClientesService } from './clientes.service';
import { environment } from '../../environments/environment';

describe('ClientesService', () => {
    let service: ClientesService;
    let httpMock: HttpTestingController;

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [HttpClientTestingModule],
            providers: [ClientesService]
        });
        service = TestBed.inject(ClientesService);
        httpMock = TestBed.inject(HttpTestingController);
    });

    afterEach(() => httpMock.verify());

    it('should fetch clientes list', () => {
        const mock = [
            { clienteId: 1, estado: 'ACTIVO', persona: { personaId: 1, nombre: 'Juan', identificacion: '1234567890' } }
        ];

        service.getClientes().subscribe(data => {
            expect(data.length).toBe(1);
            expect(data[0].persona.nombre).toBe('Juan');
        });

        const req = httpMock.expectOne(`${environment.apiUrl}/clientes`);
        expect(req.request.method).toBe('GET');
        req.flush(mock);
    });

    it('should create a cliente', () => {
        const payload = { identificacion: '0987654321', nombre: 'Ana' } as any;
        const created = { clienteId: 2, estado: 'ACTIVO', persona: { personaId: 2, nombre: 'Ana', identificacion: '0987654321' } } as any;

        service.createCliente(payload).subscribe(data => {
            expect(data.clienteId).toBe(2);
            expect(data.persona.nombre).toBe('Ana');
        });

        const req = httpMock.expectOne(`${environment.apiUrl}/clientes`);
        expect(req.request.method).toBe('POST');
        expect(req.request.body).toEqual(payload);
        req.flush(created);
    });
});