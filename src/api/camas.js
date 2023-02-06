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
  camasPorServicio(servicioId) {
    return request({
      url: '/' + this.uri + '/' + servicioId + '/listacamas',
      method: 'get'
    })
  }
  camasSinServicio() {
    return request({
      url: '/' + this.uri + '/sinservicio',
      method: 'post'
    })
  }
  vincularCamaServicio(data) {
    return request({
      url: '/' + this.uri + '/vincular',
      method: 'post',
      data: data
    })
  }
  eliminarVinculoCamaServicio(data) {
    return request({
      url: '/' + this.uri + '/eliminarvinculo',
      method: 'post',
      data: data
    })
  }
}

export { CamasResource as default }
