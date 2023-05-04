import Resource from '@/api/resource'
import request from '@/utils/request'

class TurnosAnestesiologoResource extends Resource {
  constructor() {
    super('turnos_anestesiologo')
  }
  cambiarEstado(id) {
    return request({
      url: '/' + this.uri + '/' + id + '/cambiarestado',
      method: 'post'
    })
  }
}

export { TurnosAnestesiologoResource as default }
