import trae from 'trae'
import { Message } from 'element-ui'
import { getToken } from '@/utils/auth'
import { capitalizeName } from '@/utils'
import configService from './config'

const api = trae.create({ baseUrl: configService.apiUrl })

// Keys like firstName, lastName, linkedUserFirstName, ownerLastName...
const NAME_KEY = /(first|last)name$/i

// Names come lowercased from the API; capitalize them once here so every
// screen, drawer and export shows "Leila Saleh" (86bca1x3p).
const capitalizeNames = (data) => {
  if (Array.isArray(data)) return data.forEach(capitalizeNames)
  if (!data || typeof data !== 'object') return
  Object.keys(data).forEach(key => {
    if (NAME_KEY.test(key)) data[key] = capitalizeName(data[key])
    else capitalizeNames(data[key])
  })
}

// const verbByMethod = {
//   PATCH: 'actualizado',
//   POST: 'creado',
//   DELETE: 'eliminado'
// }

const beforeMiddleware = function (config) {
  const token = getToken()
  if (token) {
    config.headers.Authorization = token
  }
  return config
}

const fulfillMiddleware = function (res) {
  capitalizeNames(res.data)
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

// List endpoints send the filtered total in X-Total-Count; expose it as `list.total`
// (null when the API doesn't send it) so pagination isn't capped at one page (86bcbqmht)
export const withTotal = res => {
  const list = res.data
  const total = res.headers && res.headers.get('X-Total-Count')
  list.total = total === null || total === undefined ? null : Number(total)
  return list
}

export default api
