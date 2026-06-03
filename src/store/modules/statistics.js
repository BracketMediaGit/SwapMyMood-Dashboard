const state = {
  statistics: {},
  monthlyStats: []
}

const mutations = {
  SET_STATISTICS: (state, statistics) => {
    state.statistics = statistics
  },
  SET_MONTHLY_STATS: (state, monthlyStats) => {
    state.monthlyStats = monthlyStats
  }
}

const actions = {}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
