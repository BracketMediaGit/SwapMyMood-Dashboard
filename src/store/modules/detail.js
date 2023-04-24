const state = {
  swaps: [],
  emotionCycles: [],
  surveys: []
}

const mutations = {
  SET_DATA: (state, data) => {
    state.swaps = data.swaps
    state.emotionCycles = data.emotionCycles
    state.surveys = data.surveys
  }
}

const actions = {
  setData ({ commit }, payload) {
    return new Promise((resolve, reject) => {
      commit('SET_DATA', payload)
      resolve()
    })
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
