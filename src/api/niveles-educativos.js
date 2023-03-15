import Resource from '@/api/resource'
import request from '@/utils/request'

class NivelesEducativosResource extends Resource {
  constructor() {
    super('niveleseducativos')
  }

  opcionesSeleccion() {
    return request({
      url: 'opcionesseleccion/' + this.uri,
      method: 'get'
    })
  }
}

export { NivelesEducativosResource as default }
