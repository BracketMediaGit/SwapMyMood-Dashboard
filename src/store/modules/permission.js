import { constantRoutes } from '@/router'

const state = {
  routes: []
}

const mutations = {
  SET_ROUTES: (state) => {
    state.routes = constantRoutes
  }
}

const actions = {}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
