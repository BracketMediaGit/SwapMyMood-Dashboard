const state = {
  statistics: {}
}

const mutations = {
  SET_STATISTICS: (state, statistics) => {
    state.statistics = statistics
  }
}

const actions = {}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
