export interface Item {
    idItem: number;
    codigo: string;
    nombre: string;
    descripcion: string;
    valorUnitario: number;
    stockMin: number;
    stockIdeal: number;
    stock: number;
    idMagnitud?: number;
    nombreMagnitud?: string;
}
