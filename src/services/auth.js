import api from './api'

const authService = {}
const endpoint = '/auth'

authService.authenticate = function (email, password) {
  return api.post(endpoint, { email, password })
    .then((res) => {
      window.localStorage.setItem('token', res.data.token)
      const user = atob(res.data.token.split('.')[1])
      window.localStorage.setItem('user', user)
      return res
    })
    .catch(err => { throw err.data })
}

authService.get = function () {
  return window.localStorage.getItem('user')
}

authService.getToken = function () {
  return window.localStorage.getItem('token')
}

authService.clearToken = function () {
  window.localStorage.removeItem('token')
}

authService.clearUser = function () {
  window.localStorage.removeItem('user')
}

authService.clear = function () {
  this.clearToken()
  this.clearUser()
}

export default authService
