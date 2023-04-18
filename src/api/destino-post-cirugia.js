import Resource from '@/api/resource'
import request from '@/utils/request'

class DestinoPostCirugiaResource extends Resource {
  constructor() {
    super('destinopostcirugia')
  }
  cambiarEstado(id) {
    return request({
      url: '/' + this.uri + '/' + id + '/cambiarestado',
      method: 'post'
    })
  }
  opciones(params) {
    return request({
      url: 'opcionesseleccion/destinopostcirugia',
      method: 'get',
      params: params
    })
  }
}

export { DestinoPostCirugiaResource as default }
