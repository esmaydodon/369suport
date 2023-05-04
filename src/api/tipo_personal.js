import Resource from '@/api/resource'
import request from '@/utils/request'

class TipoPersonalResource extends Resource {
  constructor() {
    super('tipo_personal')
  }
  opcionesSeleccion(params) {
    return request({
      url: 'opcionesseleccion/' + this.uri,
      method: 'get',
      params: params
    })
  }
}

export { TipoPersonalResource as default }
