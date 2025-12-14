export interface Persona {
    personaId?: number;
    identificacion: string;
    nombre: string;
    genero?: 'MASCULINO' | 'FEMENINO' | null;
    edad?: number | null;
    direccion?: string | null;
    telefono?: string | null;
}

export interface Cliente {
    clienteId: number;
    estado: 'ACTIVO' | 'INACTIVO';
    persona: Persona;
}

export interface CreateClienteRequest {
    persona: Persona;
    contrasena: string;
}

export interface UpdateClienteRequest {
    persona: Persona;
}