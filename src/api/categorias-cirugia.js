import Resource from '@/api/resource'
import request from '@/utils/request'

class CategoriasCirugiaResource extends Resource {
  constructor() {
    super('categoriascirugia')
  }
  cambiarEstado(id) {
    return request({
      url: '/' + this.uri + '/' + id + '/cambiarestado',
      method: 'post'
    })
  }
}

export { CategoriasCirugiaResource as default }
