
import request from '@/utils/request'

class DisponibilidadCitasResource {
  cargarData(params) {
    return request({
      url: 'disponibilidadcitas',
      method: 'get',
      params: params
    })
  }
  opciones(params) {
    return request({
      url: 'opcionesseleccion/servicioespecialidad',
      method: 'get',
      params: params
    })
  }
}

export { DisponibilidadCitasResource as default }
