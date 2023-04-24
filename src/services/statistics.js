import api from './api'

const statisticsService = {}

statisticsService.getStatistics = () => {
  return api.get('/statistics')
    .then(res => res.data)
    .catch(err => { throw err.data })
}

statisticsService.getStatisticsByDate = (params = {}) => {
  return api.get('/statistics/date', { params })
    .then(res => res.data)
    .catch(err => { throw err.data })
}

export default statisticsService
