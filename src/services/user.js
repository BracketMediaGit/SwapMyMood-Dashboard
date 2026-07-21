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

const toApiFields = (u) => ({
  firstname: u.firstName,
  lastname: u.lastName,
  email: u.email,
  password: u.password
})

userService.createUser = (newUser) => _postUser({ role: 'root', ...toApiFields(newUser) })

userService.createRegularUser = (newUser) => _postUser(toApiFields(newUser))

userService.registerUser = ({ firstname, lastname, email, password, role }) =>
  _postUser({ firstname, lastname, email, password, ...(role ? { role } : {}) })

userService.resetPassword = (email) => {
  const base = configService.apiUrl.replace(/\/$/, '')
  return fetch(`${base}/users/password`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email })
  }).then(res => {
    if (!res.ok) return res.json().then(e => Promise.reject(e))
    return res.json()
  })
}

userService.confirmResetPassword = ({ token, newPassword }) => {
  const base = configService.apiUrl.replace(/\/$/, '')
  return fetch(`${base}/users/password/reset`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ token, newPassword })
  }).then(res => {
    if (!res.ok) return res.json().then(e => Promise.reject(e))
    return res.json()
  })
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
