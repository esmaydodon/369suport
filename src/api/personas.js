import Resource from '@/api/resource'
import request from '@/utils/request'

class PersonasResource extends Resource {
  constructor() {
    super('personas')
  }

  opcionesSeleccion(params) {
    return request({
      url: 'opcionesseleccion/' + this.uri,
      method: 'get',
      params: params
    })
  }
}

export { PersonasResource as default }
