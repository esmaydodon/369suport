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
    },
    {
      path: '/cirugia',
      component: AuthLayout,
      name: 'cirugia',
      redirect: '/cirugia/salasoperaciones',
      meta: {
        title: 'Cirugia',
        icon: 'custom-config-cirugia'
      },
      children: [
        {
          path: 'salasoperaciones',
          component: () => import('@/views/administracion/configs-cirugia/salas-operaciones'),
          name: 'SalasOperaciones',
          meta: { title: 'Salas Operaciones', icon: 'custom-operations-room', noCache: true }
        }
      ]
    },
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
      path: 'diagnosticos',
      component: () => import('@/views/administracion/diagnosticos'),
      name: 'Diagnosticos',
      meta: { title: 'Diagnosticos', icon: 'el-icon-s-operation', noCache: true }
    },
    {
      path: 'operaciones',
      component: () => import('@/views/administracion/operaciones'),
      name: 'Operaciones',
      meta: { title: 'Operaciones', icon: 'el-icon-s-operation', noCache: true }
    }
  ]
}

export default AdministracionRoutes
