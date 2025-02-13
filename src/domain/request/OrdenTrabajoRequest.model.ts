export interface AgendarOrdenTrabajo {
    codigoUsuario?: string;
    idCliente: number;
    idVehiculo: number;
    idMecanico: number;
    detalle: string;
    prioridad: string;
    estado: number;
    fechaProgramada: Date;
    observacion: string;
}

export interface ActualizarOrdenRequest {
    codigo: string;
    estado: number;
    prioridad?: number;
    idMecanico?: number;
    fechaProgramada: Date;
    observacion: string;
}