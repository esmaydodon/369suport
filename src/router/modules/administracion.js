/* Layout */
import Layout from '@/layout'
import AuthLayout from '@/views/administracion/auth/layout'

const AdministracionRoutes = {
  path: '/administracion',
  component: Layout,
  name: 'Administracion',
  meta: {
    title: 'Administracion',
    icon: 'skill'
  },
  children: [
    {
      path: 'servicios',
      component: () => import('@/views/administracion/servicios'),
      name: 'Servicios',
      meta: { title: 'Servicios', icon: 'el-icon-s-operation', noCache: true }
    },
    {
      path: 'camas',
      component: () => import('@/views/administracion/camas'),
      name: 'Camas',
      meta: { title: 'Camas', icon: 'el-icon-s-operation', noCache: true }
    },
    {
      path: '/auth',
      component: AuthLayout,
      name: 'auth',
      redirect: '/auth/usuarios',
      meta: {
        title: 'Autenticación',
        icon: 'peoples',
        permissions: [
          'menu.auth.permisos',
          'menu.auth.roles',
          'menu.auth.usuarios'
        ]
      },
      children: [
        {
          path: 'permisos',
          component: () => import('@/views/administracion/auth/permisos/index'),
          name: 'Permisos',
          meta: { title: 'Permisos', icon: 'el-icon-tickets', noCache: true, permissions: ['menu.auth.permisos'] }
        },
        {
          path: 'roles',
          component: () => import('@/views/administracion/auth/roles/index'),
          name: 'Roles',
          meta: { title: 'Roles', icon: 'el-icon-tickets', noCache: true, permissions: ['menu.auth.roles'] }
        },
        {
          path: 'usuarios',
          component: () => import('@/views/administracion/auth/usuarios/index'),
          name: 'Usuarios',
          meta: { title: 'Usuarios', icon: 'el-icon-s-custom', noCache: true, permissions: ['menu.auth.usuarios'] }
        }
      ]
    }
  ]
}

export default AdministracionRoutes