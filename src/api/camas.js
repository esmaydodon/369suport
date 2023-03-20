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
  camasPorArea(servicioId) {
    return request({
      url: '/' + this.uri + '/' + servicioId + '/listacamas',
      method: 'get'
    })
  }
  camasSinArea() {
    return request({
      url: '/' + this.uri + '/sinarea',
      method: 'post'
    })
  }
  vincularCamaArea(data) {
    return request({
      url: '/' + this.uri + '/vincular',
      method: 'post',
      data: data
    })
  }
  eliminarVinculoCamaArea(data) {
    return request({
      url: '/' + this.uri + '/eliminarvinculo',
      method: 'post',
      data: data
    })
  }

  opcionesSeleccion(params) {
    return request({
      url: 'opcionesseleccion/' + this.uri,
      method: 'get',
      params: params
    })
  }
}

export { CamasResource as default }
