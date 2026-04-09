import trae from 'trae'
import { Message } from 'element-ui'
import { getToken } from '@/utils/auth'
import configService from './config'

const api = trae.create({ baseUrl: configService.apiUrl })

// const verbByMethod = {
//   PATCH: 'actualizado',
//   POST: 'creado',
//   DELETE: 'eliminado'
// }

const beforeMiddleware = function (config) {
  config.headers.Authorization = getToken()
  return config
}

const fulfillMiddleware = function (res) {
  if (res.config.method === 'GET') { return res }
  if (res.config.url.includes('auth')) { return res }
  // const message = `Recurso ${verbByMethod[res.config.method]} correctamente`

  Message.success('Success')
  return res
}

const rejectMiddleware = function (err) {
  let message = 'An error has occurred, please try again or contact support'

  if (err.status === 404) {
    message = err.data.detail || 'No resources found'
  }

  if (err.status === 403) {
    message = err.data.detail || 'This user does not have permissions to access the requested resource'
  }

  if (err.status === 401) {
    message = err.data.detail || 'Authentication required'
  }

  if (err.status === 400) {
    message = err.data.detail || 'Some field is required'
  }

  Message.error(message)

  return Promise.reject(err)
}

api.before(beforeMiddleware)
api.after(fulfillMiddleware, rejectMiddleware)

export default api
