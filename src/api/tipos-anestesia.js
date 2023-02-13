import Resource from '@/api/resource'
import request from '@/utils/request'

class TiposAnestesiaResource extends Resource {
  constructor() {
    super('tiposanestesia')
  }
  cambiarEstado(id) {
    return request({
      url: '/' + this.uri + '/' + id + '/cambiarestado',
      method: 'post'
    })
  }
}

export { TiposAnestesiaResource as default }
