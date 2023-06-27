/* Layout */
import Layout from '@/layout'
// import AuthLayout from '@/views/administracion/auth/layout'
// import CirugiaLayout from '@/views/administracion/configs-cirugia/layout'

const SoporteRoutes = {
  path: '/soporte',
  component: Layout,
  name: 'Soporte',
  meta: {
    title: 'Soporte',
    icon: 'skill'
  },
  children: [
    {
      path: 'EstadosTarea',
      component: () => import('@/views/soporte/estadotareas'),
      name: 'EstadosTarea',
      meta: { title: 'Estados De Tarea', icon: 'people', noCache: true }
    },
    {
      path: 'Tarea',
      component: () => import('@/views/soporte/tareas'),
      name: 'Tarea',
      meta: { title: 'Tareas', icon: 'people', noCache: true }
    }
    // ,
    // {
    //   path: 'Tareas',
    //   component: () => import('@/views/administracion/publics/areas'),
    //   name: 'Tareas',
    //   meta: { title: 'Tareas', icon: 'el-icon-s-operation', noCache: true }
    // }
  ]
}

export default SoporteRoutes
