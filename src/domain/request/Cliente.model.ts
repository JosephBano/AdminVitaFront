export interface Persona {
    nombre: string;
    tipoPersona: string;
    tipoDocumento?: string;
    documento: string;
    email: string;
    celular?: string;
    telefono?: string;
    direccion?: string;
    apellidos?: string;
    fechaNacimiento?: string; // ISO format: yyyy-MM-ddTHH:mm:ss
    genero?: string;
    razonSocial?: string;
    idRepresentanteLegal?: number;
    representanteLegalNombre?: string;
    obligadaContabilidad?: boolean;
    esLocal?: boolean;
    idVehiculo?: number;
    contrasenia?: string;
    idRol?: number;
}

export interface Cliente {
    nombre: string;
    tipoPersona: string;
    tipoDocumento?: string;
    documento: string;
    email: string;
    celular?: string;
    telefono?: string;
    direccion?: string;
    apellidos?: string;
    fechaNacimiento?: Date; // ISO format: yyyy-MM-ddTHH:mm:ss
    genero?: string;
    razonSocial?: string;
    idRepresentanteLegal?: number;
    representanteLegalNombre?: string;
    obligadaContabilidad?: boolean;
    esLocal?: boolean;
}

export interface Propietario {
    nombre: string;
    tipoPersona: string;
    tipoDocumento?: string;
    documento: string;
    email: string;
    celular?: string;
    telefono?: string;
    direccion?: string;
    apellidos?: string;
    fechaNacimiento?: string; // ISO format: yyyy-MM-ddTHH:mm:ss
    genero?: string;
    razonSocial?: string;
    idRepresentanteLegal?: number;
    representanteLegalNombre?: string;
    obligadaContabilidad?: boolean;
    esLocal?: boolean;
    idVehiculo?: number;
}

export interface Usuario {
    nombre: string;
    tipoPersona: string;
    tipoDocumento: string;
    documento: string;
    email: string;
    celular?: string;
    telefono?: string;
    direccion?: string;
    apellidos?: string;
    fechaNacimiento?: string; // ISO format: yyyy-MM-ddTHH:mm:ss
    genero?: string;
    razonSocial?: string;
    idRepresentanteLegal?: number;
    representanteLegalNombre?: string;
    obligadaContabilidad?: boolean;
    contrasenia?: string;
    idRol?: number;
}
