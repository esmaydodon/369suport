import Resource from '@/api/resource'
import request from '@/utils/request'

class ProvinciasResource extends Resource {
  constructor() {
    super('provincias')
  }

  opcionesSeleccion(params) {
    return request({
      url: 'opcionesseleccion/' + this.uri,
      method: 'get',
      params: params
    })
  }
}

export { ProvinciasResource as default }
