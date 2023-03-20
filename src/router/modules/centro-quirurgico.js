import Layout from '@/layout'

const CentroQuirurgicoRoutes = {
  path: '/centroquirurgico',
  component: Layout,
  name: 'CentroQuirugico',
  meta: {
    title: 'CentroQuirugico',
    icon: 'guide'
  },
  children: [
    {
      path: 'cirugias',
      component: () => import('@/views/centro-quirugico/cirugias'),
      name: 'Cirugias',
      meta: { title: 'Cirugias', icon: 'custom-operations-room', noCache: true }
    }
  ]
}

export default CentroQuirurgicoRoutes
