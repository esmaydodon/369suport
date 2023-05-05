import Resource from '@/api/resource'
import request from '@/utils/request'

class CategoriasCirugiaResource extends Resource {
  constructor() {
    super('categorias_cirugia')
  }
  cambiarEstado(id) {
    return request({
      url: '/' + this.uri + '/' + id + '/cambiarestado',
      method: 'post'
    })
  }
  opciones(params) {
    return request({
      url: 'opcionesseleccion/' + this.uri,
      method: 'get',
      params: params
    })
  }
}

export { CategoriasCirugiaResource as default }
