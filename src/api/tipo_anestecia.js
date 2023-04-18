import Resource from '@/api/resource'
import request from '@/utils/request'

class TipoAnesteciaResource extends Resource {
  constructor() {
    super('tipoanestesia')
  }

  opcionesSeleccion() {
    return request({
      url: 'opcionesseleccion/' + this.uri,
      method: 'get'
    })
  }
}

export { TipoAnesteciaResource as default }
