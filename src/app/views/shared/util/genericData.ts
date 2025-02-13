export interface genericT {
    name: string;
    code: number;
}

export const EstadosOTs = [
    {name: 'Activo', code: 0},
    {name: 'Finalizado', code: 1},
    {name: 'Finalizado sin Exito', code: 2},
    {name: 'Anulado', code: 3},
    {name: 'Pendiente', code: 4}];

export const PrioridadesOT = [
    {name: 'Crítico', code: 0},
    {name: 'Emergencia', code: 1},
    {name: 'Advertencia', code: 2},
    {name: 'Notificación', code: 3},
    {name: 'Baja prioridad', code: 4}];

export const ExpandOptionsOT = [
    { name: 'Tareas', code: 1 },
    { name: 'Insumos y repuestos', code: 2 },
    { name: 'Mecánicos', code: 3 },
    { name: 'Trabajos Externos', code: 4 },
    { name: 'Observaciones', code: 5 },
    { name: 'Solicitudes', code: 6 }];