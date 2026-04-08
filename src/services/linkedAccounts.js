import api from './api'

const linkedAccountsService = {}

linkedAccountsService.getLinkedAccounts = () => {
  return api.get('/linkedaccounts')
    .then(res => res.data)
    .catch(err => { throw err.data })
}

linkedAccountsService.unlinkAccount = (linkedAccountId) => {
  return api.delete(`/linkedaccounts/${linkedAccountId}`)
    .then(res => res.data)
    .catch(err => { throw err.data })
}

linkedAccountsService.getLinkingMetrics = () => {
  return api.get('/linkedaccounts/metrics')
    .then(res => res.data)
    .catch(err => { throw err.data })
}

linkedAccountsService.validateInvitation = (token) => {
  return api.get('/invitations/validate', { params: { token }})
    .then(res => res.data)
    .catch(err => { throw err.data })
}

linkedAccountsService.acceptInvitation = (invitationId) => {
  return api.post('/invitations/accept', { id: invitationId })
    .then(res => res.data)
    .catch(err => { throw err.data })
}

export default linkedAccountsService
