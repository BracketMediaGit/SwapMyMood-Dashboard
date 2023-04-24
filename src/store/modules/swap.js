const state = {
  swaps: [],
  problems: [],
  template: [],
  templateId: ''
}

const mutations = {
  SET_PROBLEMS: (state, problems) => {
    state.problems = problems
  },
  SET_PROBLEM: (state, problem) => {
    state.problems.push(problem)
  },
  SET_TEMPLATE: (state, template) => {
    state.template = template
  },
  SET_TEMPLATEID: (state, id) => {
    state.templateId = id
  },
  SET_SWAPS: (state, swaps) => {
    state.swaps = swaps
  }
}

const actions = {}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
