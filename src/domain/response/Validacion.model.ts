export interface ClienteValidadoXDoc {
    idPersona: number;
    documento: string;
    esClienteActivo: boolean;
}

export interface VehiculoValidadoXPlaca {
    idVehiculo: number;
    placa: string;
    marca: string;
    modelo: string;
    estado: string;
    ultimoAnioMatriculacion: string;
    ultimoAnioRTV: string;
}