import Resource from '@/api/resource'
import request from '@/utils/request'

class AreasResource extends Resource {
  constructor() {
    super('areas')
  }
  desactivar(id) {
    return request({
      url: '/' + this.uri + '/' + id + '/desactivar',
      method: 'post'
    })
  }
  cargarComboArea(query) {
    return request({
      url: '/areaseleccion/cargarComboArea',
      method: 'get',
      params: query
    })
  }
  actualizarServicio(id, servicio) {
    return request({
      url: '/' + this.uri + '/' + id + '/' + servicio + '/actualizarServicio',
      method: 'post'
    })
  }
  // camasSinServicio() {
  //   return request({
  //     url: '/' + this.uri + '/sinservicio',
  //     method: 'post'
  //   })
  // }
  // vincularCamaServicio(data) {
  //   return request({
  //     url: '/' + this.uri + '/vincular',
  //     method: 'post',
  //     data: data
  //   })
  // }
  // eliminarVinculoCamaServicio(data) {
  //   return request({
  //     url: '/' + this.uri + '/eliminarvinculo',
  //     method: 'post',
  //     data: data
  //   })
  // }
}

export { AreasResource as default }
