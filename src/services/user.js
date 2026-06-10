import api from './api'
import { getToken } from '@/utils/auth'
import configService from './config'

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

const _postUser = (body) => {
  const base = configService.apiUrl.replace(/\/$/, '')
  const token = getToken()
  return fetch(`${base}/users`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: token } : {})
    },
    body: JSON.stringify(body)
  }).then(res => {
    if (!res.ok) return res.json().then(e => Promise.reject(e))
    return res.json()
  })
}

userService.createUser = (newUser) => _postUser({ role: 'root', ...newUser })

userService.createRegularUser = (newUser) => _postUser(newUser)

userService.resetPassword = (email) => {
  return api.post('/users/password', { email })
    .then(res => res.data)
    .catch(err => { throw err.data })
}

userService.deleteUser = (id) => {
  const base = configService.apiUrl.replace(/\/$/, '')
  const token = getToken()
  return fetch(`${base}/users/${id}`, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: token } : {})
    },
    body: JSON.stringify({ confirm: true })
  }).then(res => {
    if (!res.ok) return res.json().then(e => Promise.reject(e))
    return res.json()
  })
}

export default userService
