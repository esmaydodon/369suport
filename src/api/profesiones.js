import Resource from '@/api/resource'
import request from '@/utils/request'

class ProfesionesResource extends Resource {
  constructor() {
    super('profesiones')
  }
  opcionesSeleccion(params) {
    return request({
      url: 'opcionesseleccion/' + this.uri,
      method: 'get',
      params: params
    })
  }
}

export { ProfesionesResource as default }
