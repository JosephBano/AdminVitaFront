export interface AddVehicleInstitucional {
    idTipoVehiculo: number;  
    marca: string;
    modelo: string;
    version: string;
    placa: string;
    anio: number;  // integer($int32)
    color: string;
    numeroChasis: string;
    numeroVehiculo: string;
    estado: number;  // integer($int32)
    ultimoAnioMatriculacion: number;  // integer($int32)
    ultimoAnioRTV: number;  // integer($int32)
    idLicencias: number[];  // array de números
    idCliente: number;  // integer($int32)
    archivos: any[];  // array (puedes definir el tipo si son archivos específicos)
}

export interface UpdateOptionsVehicle {
    idVehiculo: number;
    estado: number;
    ultimoAnioRTV: number;
    ultimoAnioMatriculacion: number;
    idPropietario?: number;
}
  