import Resource from '@/api/resource'
import request from '@/utils/request'

class TurnosCirugiaResource extends Resource {
  constructor() {
    super('turnoscirugia')
  }
  cambiarEstado(id) {
    return request({
      url: '/' + this.uri + '/' + id + '/cambiarestado',
      method: 'post'
    })
  }
}

export { TurnosCirugiaResource as default }
