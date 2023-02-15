/* Layout */
import Layout from '@/layout'
import AuthLayout from '@/views/administracion/auth/layout'
import CirugiaLayout from '@/views/administracion/configs-cirugia/layout'

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
      component: CirugiaLayout,
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
        },
        {
          path: 'nivelesasa',
          component: () => import('@/views/administracion/configs-cirugia/asa'),
          name: 'NivelesASA',
          meta: { title: 'Niveles ASA', icon: 'custom-list-to-do', noCache: true }
        },
        {
          path: 'categoriascirugia',
          component: () => import('@/views/administracion/configs-cirugia/categorias-cirugia'),
          name: 'CategoriasCirugia',
          meta: { title: 'Categorias Cirugia', icon: 'custom-list-to-do', noCache: true }
        },
        {
          path: 'tiposcirugia',
          component: () => import('@/views/administracion/configs-cirugia/tipos-cirugia'),
          name: 'TiposCirugia',
          meta: { title: 'Tipos Cirugia', icon: 'custom-type-surgery', noCache: true }
        },
        {
          path: 'turnoscirugia',
          component: () => import('@/views/administracion/configs-cirugia/turnos-cirugia'),
          name: 'TurnosCirugia',
          meta: { title: 'Turnos de cirugia', icon: 'custom-clock-cirugia', noCache: true }
        },
        {
          path: 'tiposanestesia',
          component: () => import('@/views/administracion/configs-cirugia/tipos-anestesia'),
          name: 'TiposAnestesia',
          meta: { title: 'Tipos Anestesia', icon: 'custom-type-anesthesia', noCache: true }
        },
        {
          path: 'turnosanestesiologo',
          component: () => import('@/views/administracion/configs-cirugia/turnos-anestesiologo'),
          name: 'TurnosAnestesiologo',
          meta: { title: 'Turnos de anestesiologo', icon: 'custom-clock-syringe', noCache: true }
        },
        {
          path: 'destinospostcirugia',
          component: () => import('@/views/administracion/configs-cirugia/destinos-post-cirugia'),
          name: 'DestinosPostCirugia',
          meta: { title: 'Destinos Post Cirugia', icon: 'custom-destination-postsurgery', noCache: true }
        }
      ]
    },
    {
      path: 'personas',
      component: () => import('@/views/administracion/personas'),
      name: 'Personas',
      meta: { title: 'Personas', icon: 'people', noCache: true }
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
    },
    {
      path: 'regiones',
      component: () => import('@/views/administracion/publics/ubicaciones-geograficas'),
      name: 'Regiones',
      meta: { title: 'Ubicaciones geograficas', icon: 'custom-map-peru', noCache: true }
    }
  ]
}

export default AdministracionRoutes
