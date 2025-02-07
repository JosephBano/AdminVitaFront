export interface ordenTrabajoListResponse {
    ordenes: ordenTrabajoList [];
}
export interface ordenTrabajoList {
    codigo: string;
    detalle: string;
    estado: number;
    fechaProgramada: string;
    nombreCli: string;
    nombreSup: string;
    placa: string;
    prioridad: number;
}

