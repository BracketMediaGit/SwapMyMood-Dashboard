import router from './router'
import store from './store'
import { Message } from 'element-ui'
import NProgress from 'nprogress' // progress bar
import 'nprogress/nprogress.css' // progress bar style
import { getToken } from '@/utils/auth' // get token from cookie
import getPageTitle from '@/utils/get-page-title'

NProgress.configure({ showSpinner: false }) // NProgress Configuration

const whiteList = ['/login', '/auth-redirect', '/accept-invitation'] // no redirect whitelist

router.beforeEach(async (to, from, next) => {
  // start progress bar
  NProgress.start()

  // set page title
  document.title = getPageTitle(to.meta.title)

  // determine whether the user has logged in
  const hasToken = getToken()

  if (hasToken) {
    if (to.path === '/login') {
      // if is logged in, redirect to the appropriate page based on role
      const hasRoles = store.getters.roles && store.getters.roles.length > 0
      console.log(hasRoles)
      if (hasRoles) {
        // Redirect based on role
        if (store.getters.roles.includes('linkedAccount')) {
          next({ path: '/user/index' })
        } else {
          next({ path: '/' })
        }
      } else {
        // Roles not loaded yet, load them first
        try {
          await store.dispatch('user/getInfo')

          if (store.getters.roles.includes('linkedAccount')) {
            next({ path: '/user/index' })
          } else {
            next({ path: '/' })
          }
        } catch (error) {
          // If error getting info, just redirect to root
          next({ path: '/' })
        }
      }
      NProgress.done()
    } else {
      const hasRoles = store.getters.roles && store.getters.roles.length > 0

      if (hasRoles && (store.getters.roles.includes('root') || store.getters.roles.includes('linkedAccount'))) {
        // Check if route has role restrictions
        if (to.meta && to.meta.roles) {
          const userRole = store.getters.roles[0] // Get user's role
          const hasPermission = to.meta.roles.includes(userRole)

          if (!hasPermission) {
            // LinkedAccount trying to access root-only route
            Message.error('You do not have permission to access this page')
            next({ path: '/user/index' })
            NProgress.done()
            return
          }
        }
        next()
      } else if (hasRoles && store.getters.roles.includes('user')) {
        await store.dispatch('user/resetToken')
        Message.error('You must be admin or linked account to access')
        next(`/login?redirect=${to.path}`)
        NProgress.done()
      } else {
        try {
          // get user info
          // note: roles must be a object array! such as: ['admin'] or ,['developer','editor']
          await store.dispatch('user/getInfo')

          // generate accessible routes map based on roles
          store.commit('permission/SET_ROUTES')

          // dynamically add accessible routes
          // router.addRoutes([])

          // hack method to ensure that addRoutes is complete
          // set the replace: true, so the navigation will not leave a history record
          next({ ...to, replace: true })
        } catch (error) {
          // remove token and go to login page to re-login
          await store.dispatch('user/resetToken')
          Message.error(error || 'Has Error')
          next(`/login?redirect=${to.path}`)
          NProgress.done()
        }
      }
    }
  } else {
    /* has no token*/

    if (whiteList.indexOf(to.path) !== -1) {
      // in the free login whitelist, go directly
      next()
    } else {
      // other pages that do not have permission to access are redirected to the login page.
      next(`/login?redirect=${to.path}`)
      NProgress.done()
    }
  }
})

router.afterEach(() => {
  // finish progress bar
  NProgress.done()
})
