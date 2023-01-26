import store from '@/store'

/**
 * Valida si el usuario tiene el rol o el permiso a verificar
 *
 * @param {*} el
 * @param {*} binding
 */
function checkPermission(el, binding) {
  const { value } = binding
  const roles = store.getters && store.getters.roles
  // obtenemos los permisos desde store
  const permissions = store.getters && store.getters.permissions

  if (value && value instanceof Array) {
    if (value.length > 0) {
      const permissionRoles = value

      const hasRole = roles.some(role => {
        return permissionRoles.includes(role)
      })

      // si no tiene el rol, verificamos si tiene el permiso
      if (!hasRole) {
        const hasPermission = permissions.some(permission => {
          return permissionRoles.includes(permission)
        })
        if (!hasPermission) {
          el.parentNode && el.parentNode.removeChild(el)
        }
      }
    }
  } else {
    throw new Error(
      `Necesita terner role y permisos! como v-permission="['public.personal.crear','smpv.solicitud.listar']"`
    )
  }
}

// function checkPermission(el, binding) {
//   const { value } = binding
//   const roles = store.getters && store.getters.roles

//   if (value && value instanceof Array) {
//     if (value.length > 0) {
//       const permissionRoles = value

//       const hasPermission = roles.some(role => {
//         return permissionRoles.includes(role)
//       })

//       if (!hasPermission) {
//         el.parentNode && el.parentNode.removeChild(el)
//       }
//     }
//   } else {
//     throw new Error(`Necesita permisos! como v-permission="['public.personal.crear','smpv.solicitud.listar']"`)
//   }
// }

export default {
  inserted(el, binding) {
    checkPermission(el, binding)
  },
  update(el, binding) {
    checkPermission(el, binding)
  }
}
