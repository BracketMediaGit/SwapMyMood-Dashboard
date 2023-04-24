import api from './api'

const emotionCycleService = {}

emotionCycleService.getEmotionCycles = (params = {}) => {
  return api.get('/emotioncycles', { params })
    .then(res => res.data)
    .catch(err => { throw err })
}

emotionCycleService.getEmotionCycleById = (id) => {
  return api.get(`/emotioncycles/dashboard/${id}`)
    .then(res => res.data)
    .catch(err => { throw err })
}

emotionCycleService.getStrategyTemplate = () => {
  return api.get('/emotioncycles/template/strategy', { params: { dashboard: true }})
    .then(res => res.data)
    .catch(err => { throw err })
}

emotionCycleService.updateStrategyTemplate = (id, template) => {
  return api.patch('/emotioncycles/template/strategy', { id, template })
    .then(res => res.data)
    .catch(err => { throw err })
}

emotionCycleService.createStrategy = (name, strategy) => {
  return api.post(`/emotioncycles/strategy/${name}`, { name: strategy })
    .then(res => res.data)
    .catch(err => { throw err })
}

emotionCycleService.getStrategies = (name) => {
  return api.get(`/emotioncycles/strategy/${name}`)
    .then(res => res.data)
    .catch(err => { throw err })
}

emotionCycleService.getEmotionCyclesByUserId = (id) => {
  return api.get(`/emotioncycles/user/${id}`)
    .then(res => res.data)
    .catch(err => { throw err.data })
}

export default emotionCycleService
