import surveyService from '@/services/survey'

const state = {
  surveys: [],
  questions: [],
  template: [],
  templateId: ''
}

const mutations = {
  SET_QUESTIONS: (state, questions) => {
    state.questions = questions
  },
  SET_QUESTION: (state, question) => {
    state.questions.push(question)
  },
  SET_TEMPLATE: (state, template) => {
    state.template = template
  },
  SET_TEMPLATEID: (state, id) => {
    state.templateId = id
  },
  SET_SURVEYS: (state, surveys) => {
    state.surveys = surveys
  }
}

const actions = {
  getData ({ commit }) {
    return new Promise((resolve, reject) => {
      Promise.all([surveyService.getQuestions(), surveyService.getTemplate()])
        .then(([questions, template]) => {
          const ids = new Set(template.statements.map(q => q.id))
          commit('SET_QUESTIONS', questions.filter(q => !ids.has(q.id)))
          commit('SET_TEMPLATE', template.statements.map(({ value, ...t }) => t))
          commit('SET_TEMPLATEID', template.templateId)
          resolve()
        })
        .catch(error => {
          reject(error)
        })
    })
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
