import { GetMecanicoT } from "./Mecanico.model";
import { ObservacionT } from "./Observacion.model";

export interface TareaDetalle {
    codigo: string;
    detalle: string;
    estado: number;
    mecanicos: GetMecanicoT[];
    duracion: number;
    requiereServicioExterno: boolean;
    requiereRepuesto: boolean;
    observaciones: ObservacionT[];
}
export interface TrabajoExternoDetalle {
    codigo: string;
    solicitante: string;
    detalle: string;
    requiereServicioExterno: boolean;
    requiereAutorizacion: boolean;
}
export interface ObservacionesOTDetalle {
    idObservacion: number;
    codigoTarea: string;
    responsable: string;
    idAdjunto: number;
    detalle: string;
    fechaRegistro: Date;
    idTipoEstadoObservacion: number;
}