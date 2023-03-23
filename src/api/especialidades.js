import Resource from '@/api/resource'
import request from '@/utils/request'

class EspecialidadesResource extends Resource {
  constructor() {
    super('especialidades')
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

export { EspecialidadesResource as default }
