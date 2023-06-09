import Resource from '@/api/resource'
import request from '@/utils/request'

class EspecialidadesResource extends Resource {
  constructor() {
    super('especialidades_medicas')
  }
  desactivar(id) {
    return request({
      url: '/' + this.uri + '/' + id + '/desactivar',
      method: 'post'
    })
  }
  opcionesSeleccion(params) {
    return request({
      url: 'opcionesseleccion/' + this.uri,
      method: 'get',
      params: params
    })
  }
  listaEspecialidades() {
    return request({
      url: '/' + this.uri + '/listaEspecialidades',
      method: 'post'
    })
  }
  vincularEspecialidadPersona(data) {
    return request({
      url: '/' + this.uri + '/vincularEspecialidadPersona',
      method: 'post',
      data: data
    })
  }
  especialidadesPorPersona(personaId) {
    return request({
      url: '/' + this.uri + '/' + personaId + '/especialidadesPorPersona',
      method: 'get'
    })
  }
  eliminarVinculoEspecialidadPersona(data) {
    return request({
      url: '/' + this.uri + '/eliminarEspecialidadPersona',
      method: 'post',
      data: data
    })
  }
}

export { EspecialidadesResource as default }
