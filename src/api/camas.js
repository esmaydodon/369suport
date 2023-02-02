import Resource from '@/api/resource'
import request from '@/utils/request'

class CamasResource extends Resource {
  constructor() {
    super('camas')
  }
  desactivar(id) {
    return request({
      url: '/' + this.uri + '/' + id + '/desactivar',
      method: 'post'
    })
  }
}

export { CamasResource as default }
