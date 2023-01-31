import Resource from '@/api/resource'
import request from '@/utils/request'

class ServiciosResource extends Resource {
  constructor() {
    super('servicios')
  }
  desactivar(id) {
    return request({
      url: '/' + this.uri + '/' + id + '/desactivar',
      method: 'post'
    })
  }
}

export { ServiciosResource as default }
