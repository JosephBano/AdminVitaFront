export interface SolicitudCrearCompra {
    idProveedor: number;
    numeroFactura: string;
    archivo?: File | null;
  }
  
  export interface RespuestaCreacionCompra {
    idCompra: number;
    idAdjunto?: number | null;
    idProveedor: number;
    fechaRegistro: string;
    numeroFactura: string;
    subtotal: number;
    iva: number;
    total: number;
  }