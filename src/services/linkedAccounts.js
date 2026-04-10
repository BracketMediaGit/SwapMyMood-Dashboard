import api from './api'

const linkedAccountsService = {}

linkedAccountsService.getLinkedAccounts = () => {
  return api.get('/linkedaccounts')
    .then(res => res.data)
    .catch(err => { throw err.data })
}

linkedAccountsService.unlinkAccount = (linkedAccountId) => {
  return api.patch(`/linkedaccounts/${linkedAccountId}`)
    .then(res => res.data)
    .catch(err => { throw err.data })
}

linkedAccountsService.getLinkingMetrics = (params = {}) => {
  return api.get('/linkedaccounts/metrics', { params })
    .then(res => res.data)
    .catch(err => { throw err.data })
}

linkedAccountsService.validateInvitation = (token) => {
  return api.get('/invitations/validate', { params: { token }})
    .then(res => res.data)
    .catch(err => { throw err.data })
}

linkedAccountsService.acceptInvitation = (invitationId) => {
  return api.post('/invitations/accept', { invitationId: invitationId })
    .then(res => res.data)
    .catch(err => { throw err.data })
}

// ============================================================================
// TESTING ONLY - DELETE WHEN MOBILE APP IS READY
// ============================================================================
linkedAccountsService.sendInvitation = (email, inviterId) => {
  return api.post('/invitations/test-invite', { email, inviterId })
    .then(res => res.data)
    .catch(err => { throw err.data })
}
// ============================================================================
// END TESTING CODE
// ============================================================================

export default linkedAccountsService
