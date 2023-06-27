import Resource from '@/api/resource'
import request from '@/utils/request'

class EstadoTareaResource extends Resource {
  constructor() {
    super('estadotarea')
  }

  opcionesSeleccion(params) {
    return request({
      url: 'opcionesseleccion/' + this.uri,
      method: 'get',
      params: params
    })
  }

  // getPersonaDocumento(dni) {
  //   return request({
  //     url: '/' + this.uri + '/getPersonaDocumento/' + dni,
  //     method: 'get's
  //   })
  // }

  // opcionesSeleccionTrabajadores(params) {
  //   return request({
  //     url: 'opcionesseleccion/' + this.uri + '/trabajadores',
  //     method: 'get',
  //     params: params
  //   })
  // }
}

export { EstadoTareaResource as default }
