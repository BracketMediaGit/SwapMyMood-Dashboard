import api from './api'
import { getToken } from '@/utils/auth'

const statisticsService = {}

// Helper function to check if user is root
const isRootUser = () => {
  const token = getToken()
  if (!token) return false
  try {
    const user = JSON.parse(atob(token.split('.')[1]))
    return user.role.name === 'root'
  } catch (e) {
    return false
  }
}

statisticsService.getStatistics = () => {
  // Only root can access statistics
  if (!isRootUser()) {
    return Promise.reject({ detail: 'Only root users can access statistics' })
  }

  return api.get('/statistics')
    .then(res => res.data)
    .catch(err => { throw err.data })
}

statisticsService.getStatisticsByDate = (params = {}) => {
  // Only root can access statistics
  if (!isRootUser()) {
    return Promise.reject({ detail: 'Only root users can access statistics' })
  }

  return api.get('/statistics/date', { params })
    .then(res => res.data)
    .catch(err => { throw err.data })
}

export default statisticsService
