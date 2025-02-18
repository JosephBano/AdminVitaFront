export interface Column {
    field: string;
    header: string;
    sort: boolean;
    type: string;
  }

export const HeadersTables = {
  OrdenesTrabajoList: [
    { field: 'codigo', header: 'Código', sort: false, type: '' },
    { field: 'nombreCli', header: 'Cliente', sort: true, type: 'text'},
    { field: 'detalle', header: 'Detalle OT', sort: true, type: 'text'},
    { field: 'fechaProgramada', header: 'Fecha Programada', sort: true, type: 'date' },
    { field: 'estado', header: 'Estado', sort: false, type: '' },
    { field: 'nombreSup', header: 'Supervisor', sort: true, type: 'text'},
    { field: 'placa', header: 'Placa', sort: false, type: 'text'},
    { field: 'prioridad', header: 'Prioridad', sort: false, type: '' },
    { field: 'actions', header: 'Acciones', sort: false, type: '' }
  ],
  VehiculosList: [
    { field: 'placa', header: 'Placa', sort: false, type: '' },
    { field: 'tipoVehiculo', header: 'Tipo Vehiculo', sort: true, type: 'text' },
    { field: 'estado', header: 'Estado', sort: false, type: '' },
    { field: 'licencia', header: 'Licencia', sort: true, type: 'text' },
    { field: 'numeroVehiculo', header: 'Numero Vehiculo', sort: true, type: 'numeric'},
    { field: 'marca', header: 'Marca', sort: true, type: 'text' },
    { field: 'anio', header: 'Año', sort: true, type: 'text' },
    { field: 'ultimoAnioRTV', header: 'RTV', sort: true, type: 'text' },
    { field: 'ultimoAnioMatriculacion', header: 'Matriculado', sort: true, type: 'text' },
    { field: 'actions', header: 'Acciones', sort: false, type: '' }
  ],
}