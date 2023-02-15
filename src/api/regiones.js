import Resource from '@/api/resource'
import request from '@/utils/request'

class RegionesResource extends Resource {
  constructor() {
    super('regiones')
  }

  opcionesSeleccion() {
    return request({
      url: 'opcionesseleccion/' + this.uri,
      method: 'get'
    })
  }
}

export { RegionesResource as default }
