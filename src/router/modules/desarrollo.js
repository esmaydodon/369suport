/* Layout */
import Layout from '@/layout'

const DesarrolloRoutes = {
  path: '/desarrollo',
  component: Layout,
  name: 'Desarrollo',
  meta: {
    title: 'Desarrollo',
    icon: 'guide',
    permissions: [
      'menu.desarrollo'
    ]
  },
  children: [
    {
      path: 'calendario',
      component: () => import('@/views/desarrollo/calendario'),
      name: 'Calendario',
      meta: { title: 'Clendario', icon: 'table', noCache: true }
    }
  ]
}

export default DesarrolloRoutes
