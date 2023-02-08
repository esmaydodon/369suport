import Resource from '@/api/resource'
import request from '@/utils/request'

class SalasOperacionesResource extends Resource {
  constructor() {
    super('salasoperaciones')
  }
  cambiarEstado(id) {
    return request({
      url: '/' + this.uri + '/' + id + '/cambiarestado',
      method: 'post'
    })
  }
}

export { SalasOperacionesResource as default }
