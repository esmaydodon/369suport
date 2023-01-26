import request from '@/utils/request'
import Resource from '@/api/resource'

class RoleResource extends Resource {
  constructor() {
    super('roles')
  }

  permissions(id) {
    return request({
      url: '/' + this.uri + '/' + id + '/permissions',
      method: 'get'
    })
  }

  permissionsUpdate(id, data) {
    return request({
      url: '/' + this.uri + '/' + id + '/permissions',
      method: 'post',
      data
    })
  }

  getRoutes() {
    return request({
      url: '/' + this.uri + '/routes',
      method: 'get'
    })
  }

  getCboRoles() {
    return request({
      url: '/' + this.uri + '/cboroles',
      method: 'get'
    })
  }

  addRole(data) {
    return request({
      url: '/' + this.uri + '/role',
      method: 'post',
      data
    })
  }

  updateRole(id, data) {
    return request({
      url: '/' + this.uri + '/role/' + id, // '/role/${id}`,
      method: 'put',
      data
    })
  }

  deleteRole(id) {
    return request({
      url: '/' + this.uri + '/role/' + id, // `/role/${id}`,
      method: 'delete'
    })
  }
}

export { RoleResource as default }
