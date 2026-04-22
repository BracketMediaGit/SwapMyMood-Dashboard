import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

/* Layout */
import Layout from '@/layout'

/* Router Modules */
import swapRouter from './modules/swap'
import emotionCycleRouter from './modules/emotionCycle'

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
    title: 'title'               the name show in sidebar and breadcrumb (recommend set)
    icon: 'svg-name'             the icon show in the sidebar
    noCache: true                if set true, the page will no be cached(default is false)
    affix: true                  if set true, the tag will affix in the tags-view
    breadcrumb: false            if set false, the item will hidden in breadcrumb(default is true)
    activeMenu: '/example/list'  if set path, the sidebar will highlight the path you set
  }
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
    path: '/accept-invitation',
    component: () => import('@/views/accept-invitation/index'),
    hidden: true
  },
  {
    path: '/terms-and-conditions',
    component: () => import('@/views/terms-and-conditions/index'),
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
    redirect: '/dashboard',
    children: [
      {
        path: '/',
        component: () => import('@/views/dashboard-swap/index'),
        name: 'Dashboard',
        meta: { title: 'Dashboard', icon: 'dashboard', affix: false, roles: ['root'] }
      }
    ]
  },
  {
    path: '/user',
    component: Layout,
    name: 'User',
    meta: {
      title: 'Users',
      icon: 'user'
    },
    children: [
      {
        path: 'index',
        component: () => import('@/views/user/list-user/index'),
        name: 'Users',
        meta: { title: 'Users', icon: 'user', affix: false }
      },
      {
        path: 'create-user',
        component: () => import('@/views/user/create-user/index'),
        name: 'CreateUsers',
        meta: { title: 'Create user', icon: 'user', affix: false, roles: ['root'] }
      },
      {
        path: 'reset-password',
        component: () => import('@/views/user/reset-password/index'),
        name: 'ResetPassword',
        meta: { title: 'Reset Password', icon: 'lock', affix: false, roles: ['root'] }
      },
      {
        path: 'detail/:id',
        component: () => import('@/views/user/detail/index'),
        name: 'UserDetails',
        meta: { title: 'User Details' },
        hidden: true
      }
    ]
  },
  swapRouter,
  emotionCycleRouter,
  {
    path: 'https://console.firebase.google.com/',
    component: Layout,
    name: 'Firebase Analytics',
    meta: {
      title: 'Firebase Analytics',
      icon: 'analytics',
      roles: ['root']
    }
  },
  {
    path: '/profile',
    component: Layout,
    redirect: '/profile/index',
    hidden: true,
    children: [
      {
        path: 'index',
        component: () => import('@/views/profile/index'),
        name: 'Profile',
        meta: { title: 'Profile', icon: 'user', noCache: true }
      }
    ]
  },
  // ============================================================================
  // TESTING ONLY - DELETE THIS ROUTE WHEN MOBILE APP IS READY
  // ============================================================================
  {
    path: '/test-invitation',
    component: Layout,
    hidden: true,
    meta: { roles: ['root'] },
    children: [
      {
        path: '',
        component: () => import('@/views/test-invitation/index'),
        name: 'TestInvitation',
        meta: { title: 'Test Invitation', icon: 'bug', roles: ['root'] }
      }
    ]
  },
  // ============================================================================
  // END TESTING ROUTE
  // ============================================================================
  { path: '*', redirect: '/404', hidden: true }
]

const createRouter = () => new Router({
  mode: 'history', // require service support
  scrollBehavior: () => ({ y: 0 }),
  routes: constantRoutes
})

const router = createRouter()

export function resetRouter () {
  const newRouter = createRouter()
  router.matcher = newRouter.matcher // reset router
}

export default router
