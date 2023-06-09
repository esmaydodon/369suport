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

  getPersonaDocumento(dni) {
    return request({
      url: '/' + this.uri + '/getPersonaDocumento/' + dni,
      method: 'get'
    })
  }

  opcionesSeleccionTrabajadores(params) {
    return request({
      url: 'opcionesseleccion/' + this.uri + '/trabajadores',
      method: 'get',
      params: params
    })
  }
}

export { PersonasResource as default }
