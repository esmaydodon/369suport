import Resource from '@/api/resource'
import request from '@/utils/request'

class DiagnosticosResource extends Resource {
  constructor() {
    super('diagnosticos')
  }
  desactivar(id) {
    return request({
      url: '/' + this.uri + '/' + id + '/desactivar',
      method: 'post'
    })
  }
}

export { DiagnosticosResource as default }
