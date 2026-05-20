import { getToken } from '@/utils/auth'
import configService from './config'

const legalService = {}

const request = (path, options = {}) => {
  const base = configService.apiUrl.replace(/\/$/, '')
  const token = getToken()
  const headers = {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: token } : {})
  }
  return fetch(`${base}${path}`, { headers, ...options })
}

legalService.getTerms = () => {
  return request('/legal/terms')
    .then(res => res.ok ? res.json() : { content: '', updatedAt: null })
    .catch(() => ({ content: '', updatedAt: null }))
}

legalService.getPrivacy = () => {
  return request('/legal/privacy')
    .then(res => res.ok ? res.json() : { content: '', updatedAt: null })
    .catch(() => ({ content: '', updatedAt: null }))
}

const patchLegal = (path, content) => {
  return request(path, { method: 'PATCH', body: JSON.stringify({ content }) })
    .then(res => {
      if (!res.ok) {
        return res.text().then(text => {
          console.error(`[legal] PATCH ${path} → ${res.status}`, text)
          let parsed = {}
          try { parsed = JSON.parse(text) } catch (e) {}
          return Promise.reject(parsed)
        })
      }
      return res.json()
    })
}

legalService.updateTerms = (content) => patchLegal('/legal/terms', content)

legalService.updatePrivacy = (content) => patchLegal('/legal/privacy', content)

export default legalService
