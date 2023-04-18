import Resource from '@/api/resource'
import request from '@/utils/request'

class AsaResource extends Resource {
  constructor() {
    super('asa')
  }
  cambiarEstado(id) {
    return request({
      url: '/' + this.uri + '/' + id + '/cambiarestado',
      method: 'post'
    })
  }
  opciones(params) {
    return request({
      url: 'opcionesseleccion/asa',
      method: 'get',
      params: params
    })
  }
}

export { AsaResource as default }
