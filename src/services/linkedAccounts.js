import api from './api'
import { getToken } from '@/utils/auth'

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
  // Explicitly pass Authorization header to avoid timing issues right after login
  const auth = getToken()
  return api.post('/invitations/accept', { invitationId: invitationId }, { headers: { Authorization: auth }})
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
