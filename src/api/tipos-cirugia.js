import Resource from '@/api/resource'
import request from '@/utils/request'

class TiposCirugiaResource extends Resource {
  constructor() {
    super('tiposcirugia')
  }
  cambiarEstado(id) {
    return request({
      url: '/' + this.uri + '/' + id + '/cambiarestado',
      method: 'post'
    })
  }
  opciones(params) {
    return request({
      url: 'opcionesseleccion/tipocirugia',
      method: 'get',
      params: params
    })
  }
}

export { TiposCirugiaResource as default }
