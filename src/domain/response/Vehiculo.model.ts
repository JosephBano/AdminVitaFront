import { Propietario } from "./Cliente.model";
import { Licencia } from "./Licencia.model";

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

export interface tipoVehiculo {
    
}

export interface VehicleDetalleResponse {
    idVehiculo: number;
    marca: string;
    modelo: string;
    version: string;
    placa: string;
    anio: number;
    color: string;
    numeroChasis: string;
    numeroVehiculo: string;
    estado: number;
    ultimoAnioMatriculacion: number;
    ultimoAnioRTV: number;
    tipoVehiculo: string;
    propietario: Propietario;
    licencias: Licencia[];
  }
  
  