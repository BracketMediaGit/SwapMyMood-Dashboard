import api from './api'

const surveyService = {}

surveyService.getQuestions = () => {
  return api.get('/surveys/questions')
    .then(res => res.data)
    .catch(err => { throw err.data })
}

surveyService.createQuestion = (name) => {
  return api.post('/surveys/question', {
    name
  })
    .then(res => res.data)
    .catch(err => { throw err.data })
}

surveyService.deleteQuestion = (id) => {
  return api.delete(`/surveys/question/${id}`)
    .then(res => res.data)
    .catch(err => { throw err.data })
}

surveyService.getTemplate = () => {
  return api.get('/surveys/template')
    .then(res => res.data)
    .catch(err => { throw err.data })
}

surveyService.updateTemplate = (id, statements) => {
  return api.patch('/surveys/template', {
    templateId: id,
    statements
  })
    .then(res => res.data)
    .catch(err => { throw err.data })
}

surveyService.getSurveys = (params = {}) => {
  return api.get('/surveys', { params })
    .then(res => res.data)
    .catch(err => { throw err.data })
}

surveyService.getSurveysByUserId = (id) => {
  return api.get(`/surveys/user/${id}`)
    .then(res => res.data)
    .catch(err => { throw err.data })
}

export default surveyService
