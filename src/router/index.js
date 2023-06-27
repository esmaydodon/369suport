import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

/* Layout */
import Layout from '@/layout'
import AdministracionRoutes from './modules/administracion'
import SoporteRoutes from './modules/soporte'
// import DesarrolloRoutes from './modules/desarrollo'
// import CentroQuirurgicoRoutes from './modules/centro-quirurgico'

/* Router Modules */
// import componentsRouter from './modules/components'
// import chartsRouter from './modules/charts'
// import tableRouter from './modules/table'
// import nestedRouter from './modules/nested'

/**
 * Note: sub-menu only appear when route children.length >= 1
 * Detail see: https://panjiachen.github.io/vue-element-admin-site/guide/essentials/router-and-nav.html
 *
 * hidden: true                   if set true, item will not show in the sidebar(default is false)
 * alwaysShow: true               if set true, will always show the root menu
 *                                if not set alwaysShow, when item has more than one children route,
 *                                it will becomes nested mode, otherwise not show the root menu
 * redirect: noRedirect           if set noRedirect will no redirect in the breadcrumb
 * name:'router-name'             the name is used by <keep-alive> (must set!!!)
 * meta : {
    roles: ['admin','editor']    control the page roles (you can set multiple roles)
    permissions: ['permiso','otro_permiso']
    title: 'title'               the name show in sidebar and breadcrumb (recommend set)
    icon: 'svg-name'/'el-icon-x' the icon show in the sidebar
    noCache: true                if set true, the page will no be cached(default is false)
    affix: true                  if set true, the tag will affix in the tags-view
    breadcrumb: false            if set false, the item will hidden in breadcrumb(default is true)
    activeMenu: '/example/list'  if set path, the sidebar will highlight the path you set
  }
 */

/**
 * constantRoutes
 * a base page that does not have permission requirements
 * all roles can be accessed
 */
export const constantRoutes = [
  {
    path: '/redirect',
    component: Layout,
    hidden: true,
    children: [
      {
        path: '/redirect/:path(.*)',
        component: () => import('@/views/redirect/index')
      }
    ]
  },
  {
    path: '/login',
    component: () => import('@/views/login/index'),
    hidden: true
  },
  {
    path: '/auth-redirect',
    component: () => import('@/views/login/auth-redirect'),
    hidden: true
  },
  {
    path: '/404',
    component: () => import('@/views/error-page/404'),
    hidden: true
  },
  {
    path: '/401',
    component: () => import('@/views/error-page/401'),
    hidden: true
  },
  {
    path: '/',
    component: Layout,
    redirect: '/panelcontrol',
    children: [
      {
        path: 'panelcontrol',
        component: () => import('@/views/dashboard/index'),
        name: 'Dashboard',
        // meta: { title: 'Dashboard', icon: 'dashboard', affix: true }
        meta: { title: 'Panel de control', icon: 'dashboard' }
      }
    ]
  },
  {
    path: '/miperfil',
    component: Layout,
    redirect: '/miperfil/usuario',
    hidden: true,
    children: [
      {
        path: 'usuario',
        component: () => import('@/views/profile/index'),
        name: 'Profile',
        meta: { title: 'Profile', icon: 'user', noCache: true }
      }
    ]
  },
  {
    path: '/disponibilidadcitas',
    component: () => import('@/views/nouser/disponibilidadcitas'),
    hidden: true
  }
]

/**
 * asyncRoutes
 * the routes that need to be dynamically loaded based on user roles
 */
export const asyncRoutes = [
  AdministracionRoutes,
  SoporteRoutes
  // DesarrolloRoutes
  // CentroQuirurgicoRoutes,
  // {
  //   path: '/historiasclinicas',
  //   component: Layout,
  //   redirect: '/historiasclinicas/index',
  //   children: [
  //     {
  //       path: 'index',
  //       component: () => import('@/views/publics/historiasclinicas'),
  //       name: 'HistoriasClinicas',
  //       meta: { title: 'Historias Clinicas', icon: 'custom-list-to-do', noCache: true }
  //     }
  //   ]
  // },
  // 404 page must be placed at the end a!!!
  // { path: '*', redirect: '/404', hidden: true }
]

const createRouter = () => new Router({
  // mode: 'history', // require service support
  scrollBehavior: () => ({ y: 0 }),
  routes: constantRoutes
})

const router = createRouter()

// Detail see: https://github.com/vuejs/vue-router/issues/1234#issuecomment-357941465
export function resetRouter() {
  const newRouter = createRouter()
  router.matcher = newRouter.matcher // reset router
}

export default router
