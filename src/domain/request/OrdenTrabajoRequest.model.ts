export interface AgendarOrdenTrabajo {
    idUsuario: string;
    idCliente: string;
    idVehiculo: string;
    idMecanico: string;
    detalle: string;
    prioridad: string;
    estado: string;
    fechaProgramada: Date;
    observacion: string;
}

export interface ActualizarOrdenRequest {
    codigo: string;
    estado: string;
    prioridad: string;
    idMecanico: string;
    fechaProgramada: Date;
    observacion: string;
}