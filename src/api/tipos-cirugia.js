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
}

export { TiposCirugiaResource as default }
