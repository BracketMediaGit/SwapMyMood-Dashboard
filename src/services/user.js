import api from './api'

const userService = {}

userService.queryUsers = (params = {}) => {
  return api.get('/users', { params })
    .then(res => res.data)
    .catch(err => { throw err.data })
}

userService.getUserDetailsById = (id) => {
  return api.get(`/users/${id}/details`)
    .then(res => res.data)
    .catch(err => { throw err.data })
}

userService.createUser = (newUser) => {
  return api.post('/users', { role: 'root', ...newUser })
    .then(res => res.data)
    .catch(err => { throw err.data })
}

userService.resetPassword = (email) => {
  return api.post('/users/password', { email })
    .then(res => res.data)
    .catch(err => { throw err.data })
}

export default userService
