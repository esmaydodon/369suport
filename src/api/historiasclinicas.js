import Resource from '@/api/resource'
import request from '@/utils/request'

class HistoriasClinicasResource extends Resource {
  constructor() {
    super('historiasclinicas')
  }

  detalle(historiaclinica_id) {
    return request({
      url: '/' + this.uri + '/' + historiaclinica_id + '/detalleHistoriaClinica',
      method: 'get'
    })
  }
}

export { HistoriasClinicasResource as default }