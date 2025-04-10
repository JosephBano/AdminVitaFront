export interface SupervisorInputSelect {
    idMecanico: number;
    nombre: string;
}

export interface GetMecanicoT {
    idMecanico: number;
    nombreCompleto: string;
}

export interface ManoDeObra {
    codigo: string;
    nombreCodigo: string;
    esSupervisor: boolean;
    codigoTarea: string;
    especialidad: string;
    duracion: number;
}