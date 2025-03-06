export interface AdquisicionListResponse {
    idCompra: number;
    numeroFactura: string;
    fechaRegistro: string;
    subtotal: number;
    iva: number;
    total: number;
    documento: string;
    nombre: string;
    apellidos?: string | null;
    razonSocial?: string | null; // Opcional, puede ser null
  }
  