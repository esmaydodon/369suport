import Resource from '@/api/resource'
import request from '@/utils/request'

class TurnosAnasteciologoResource extends Resource {
  constructor() {
    super('turnosanasteciologo')
  }
  cambiarEstado(id) {
    return request({
      url: '/' + this.uri + '/' + id + '/cambiarestado',
      method: 'post'
    })
  }
}

export { TurnosAnasteciologoResource as default }
