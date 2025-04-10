export interface CreateUpdateItemRequest {
    idItem: number;
    idTipoItem: number;
    idMagnitud: number;
    nombre: string;
    descripcion: string;
    valorUnitario: number;
    stockMin: number;
    stockIdeal: number;
}