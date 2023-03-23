import Resource from '@/api/resource'
import request from '@/utils/request'

class CargosResource extends Resource {
  constructor() {
    super('cargos')
  }
  desactivar(id) {
    return request({
      url: '/' + this.uri + '/' + id + '/desactivar',
      method: 'post'
    })
  }
  cargarComboArea(query) {
    return request({
      url: '/cargoseleccion/cargarComboCargos',
      method: 'get',
      params: query
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

export { CargosResource as default }
