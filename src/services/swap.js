import api from './api'

const swapService = {}

swapService.querySwaps = (params = {}) => {
  return api.get('/swaps', { params })
    .then(res => res.data)
    .catch(err => { throw err.data })
}

swapService.getSwapById = (id) => {
  return api.get(`/swaps/dashboard/${id}`)
    .then(res => res.data)
    .catch(err => { throw err.data })
}

swapService.getSwapsByUserId = (id) => {
  return api.get(`/swaps/user/${id}`)
    .then(res => res.data)
    .catch(err => { throw err.data })
}

export default swapService
