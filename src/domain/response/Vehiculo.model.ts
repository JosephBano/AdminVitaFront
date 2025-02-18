export interface VehiculosList {
    placa: string;
    tipoVehiculo: string;
    estado: number | null;
    numeroVehiculo: string | null;
    marca: string;
    anio: number;
    ultimoAnioRTV: number | null;
    ultimoAnioMatriculacion: number | null;
    licencia: Licencia[] | null;
}

export interface Licencia {
    idLicencia: number;
    detalle: string;
    esProfesional: boolean;
}
  