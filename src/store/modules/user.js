// import Cookies from 'js-cookie'
// import { login, logout, getInfo } from '@/api/user'
import { login, logout, getInfo } from '@/api/auth'
import { getToken, setToken, removeToken } from '@/utils/auth'
import router, { resetRouter } from '@/router'
// import permission from '@/directive/permission'
import store from '@/store'
// TODO: Actualizar la ruta del avatar
import user_avatar from '@/assets/img/user.png'

const state = {
  id: null, // added
  user: null, // added
  token: getToken(),
  name: '',
  dni: '',
  email: '',
  avatar: '',
  introduction: '', // no utilizar, se va eliminar
  roles: [],
  permissions: [], // added
  avatarDefault: user_avatar
}

const mutations = {
  SET_ID: (state, id) => {
    // added mutation
    state.id = id
  },
  SET_TOKEN: (state, token) => {
    state.token = token
  },
  SET_INTRODUCTION: (state, introduction) => {
    state.introduction = introduction
  },
  SET_NAME: (state, name) => {
    state.name = name
  },
  SET_DNI: (state, dni) => {
    state.dni = dni
  },
  SET_EMAIL: (state, email) => {
    state.email = email
  },
  SET_AVATAR: (state, avatar) => {
    state.avatar = avatar
  },
  SET_ROLES: (state, roles) => {
    state.roles = roles
  },
  SET_PERMISSIONS: (state, permissions) => { // added mutation
    state.permissions = permissions
  }
}

const actions = {
  // user login
  login({ commit }, userInfo) {
    const { username, password } = userInfo
    return new Promise((resolve, reject) => {
      login({
        username: username.trim(),
        password: password,
        device_name: 'desktop'
      })
        .then(response => {
          const { data } = response

          commit('SET_TOKEN', data.token)
          setToken(data.token)
          resolve()
        })
        .catch(error => {
          reject(error)
        })
    })
  },

  // get user info
  getInfo({ commit, state }) {
    return new Promise((resolve, reject) => {
      getInfo(state.token)
        .then(response => {
          const { data } = response
          if (!data) {
            reject(
              'Ha surgido un error, inténtelo nuevamente'
            )
          }

          const {
            roles,
            name,
            dni,
            email,
            avatar,
            introduction,
            permissions,
            id
          } = data

          // roles must be a non-empty array
          if (!roles || roles.length <= 0) {
            reject(
              'El usuario no cuenta con un rol asignado'
            )
          }
          // roles must be a non-empty array
          if (!permissions || permissions.length <= 0) {
            reject(
              'El usuario no cuenta con permisos asignados'
            )
          }

          let mi_avatar = null
          if (!avatar || avatar == null) {
            mi_avatar = user_avatar
          } else {
            mi_avatar = avatar
          }
          commit('SET_ROLES', roles)
          commit('SET_PERMISSIONS', permissions)
          commit('SET_NAME', name)
          commit('SET_DNI', dni)
          commit('SET_EMAIL', email)
          commit('SET_AVATAR', mi_avatar)
          commit('SET_INTRODUCTION', introduction) // no utilizar, se va eliminar
          commit('SET_ID', id)
          resolve(data)
        })
        .catch(error => {
          reject(error)
        })
    })
  },

  // user logout
  logout({ commit, state, dispatch }) {
    return new Promise((resolve, reject) => {
      logout(state.token)
        .then(() => {
          commit('SET_TOKEN', '')
          commit('SET_ROLES', [])
          removeToken()
          resetRouter()

          // reset visited views and cached views
          // to fixed https://github.com/PanJiaChen/vue-element-admin/issues/2485
          dispatch('tagsView/delAllViews', null, { root: true })

          resolve()
        })
        .catch(error => {
          reject(error)
        })
    })
  },

  // remove token
  resetToken({ commit }) {
    return new Promise(resolve => {
      commit('SET_TOKEN', '')
      commit('SET_ROLES', [])
      removeToken()
      resolve()
    })
  },

  // dynamically modify permissions
  // async changeRoles({ commit, dispatch }, role) {
  async changeRoles({ commit, dispatch }, role) {
    // eslint-disable-next-line no-async-promise-executor
    return new Promise(async resolve => {
      // const token = role + '-token'

      // commit('SET_TOKEN', token)
      // setToken(token)

      // const { roles } = await dispatch('getInfo')
      const roles = [role.name]
      const permissions = role.permissions.map(permission => permission.name)
      commit('SET_ROLES', roles)
      commit('SET_PERMISSIONS', permissions)
      resetRouter()

      // generate accessible routes map based on roles and permissions
      const accessRoutes = await store.dispatch('permission/generateRoutes', { roles, permissions }, {
        root: true
      })
      // dynamically add accessible routes
      router.addRoutes(accessRoutes)

      // reset visited views and cached views
      dispatch('tagsView/delAllViews', null, { root: true })

      resolve() // added
    }) // end Promise
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
