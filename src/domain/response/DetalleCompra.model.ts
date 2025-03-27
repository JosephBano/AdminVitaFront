export interface DetalleCompra {
    idDetalleCompra?: number;
    idCompra: number;
    idItem: number;
    idMagnitud: number;
    cantidad: number;
    cantidadBase : number;
    valorUnitario: number;
  }
  
  export interface CreateUpdateDetalleCompraRequest {
    detallesCompra: DetalleCompra[];
  }
  
  export interface DetalleCompraResponse {
    success: boolean;
    mensaje: string;
    detallesCompra?: DetalleCompra[];
  }