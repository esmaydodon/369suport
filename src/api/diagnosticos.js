import Resource from '@/api/resource'
import request from '@/utils/request'

class DiagnosticosResource extends Resource {
  constructor() {
    super('diagnosticos')
  }
  desactivar(id) {
    return request({
      url: '/' + this.uri + '/' + id + '/desactivar',
      method: 'post'
    })
  }

  opcionesSeleccion(params) {
    return request({
      url: 'opcionesseleccion/' + this.uri,
      method: 'get',
      params: params
    })
  }
}

export { DiagnosticosResource as default }
