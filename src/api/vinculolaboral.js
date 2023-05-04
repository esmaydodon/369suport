import Resource from '@/api/resource'
import request from '@/utils/request'

class VinculoLaboralResource extends Resource {
  constructor() {
    super('vinculo_laboral')
  }

  detalle(vinculo_laboral_id) {
    return request({
      url: '/' + this.uri + '/' + vinculo_laboral_id + '/detalleVinculoLaboral',
      method: 'get'
    })
  }
}

export { VinculoLaboralResource as default }
