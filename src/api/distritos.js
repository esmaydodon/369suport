import Resource from '@/api/resource'
import request from '@/utils/request'

class DistritosResource extends Resource {
  constructor() {
    super('distritos')
  }

  opcionesSeleccion(params) {
    return request({
      url: 'opcionesseleccion/' + this.uri,
      method: 'get',
      params: params
    })
  }
}

export { DistritosResource as default }
