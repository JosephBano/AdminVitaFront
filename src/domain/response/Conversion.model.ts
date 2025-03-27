export interface ConversionRequest {
    idMagnitudOrigen: number;
    unidadOrigen: number;
    idMagnitudDestino: number;
  }
  
  export interface ConversionResponse {
    nombreMagnitudOrigen: string;
    unidadOrigen: number;
    nombreMagnitudDestino: string;
    unidadDestino: number;
  }