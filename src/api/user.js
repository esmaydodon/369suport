import request from '@/utils/request'
import Resource from '@/api/resource'

class UserResource extends Resource {
  constructor() {
    super('users')
  }

  permissions(id) {
    return request({
      url: '/' + this.uri + '/' + id + '/permissions',
      method: 'get'
    })
  }

  updatePermission(id, permissions) {
    return request({
      url: '/' + this.uri + '/' + id + '/permissions',
      method: 'put',
      data: permissions
    })
  }

  actualizarMiclave(data) {
    return request({
      url: '/actualizar/miclave',
      method: 'post',
      data: data
    })
  }

  motorizados() {
    return request({
      url: '/motorizados',
      method: 'get'
    })
  }
}

export { UserResource as default }
