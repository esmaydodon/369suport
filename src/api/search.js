import request from '@/utils/request'

export function userSearch(name) {
  return request({
    url: '/search/user',
    method: 'get',
    params: { name }
  })
}

export function datosDashboard(query) {
  return request({
    url: '/datosdashboard',
    method: 'get',
    params: query
  })
}
