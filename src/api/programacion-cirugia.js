import Resource from '@/api/resource'
import request from '@/utils/request'

class ProgramacionCirugiaResource extends Resource {
  constructor() {
    super('programacion_cirugia')
  }

  opcionesSeleccion(params) {
    return request({
      url: 'opcionesseleccion/' + this.uri,
      method: 'get',
      params: params
    })
  }
}

export { ProgramacionCirugiaResource as default }
