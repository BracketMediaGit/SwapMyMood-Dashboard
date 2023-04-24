import api from './api'

const prepopulatedService = {}

prepopulatedService.getPrepopulated = (name) => {
  return api.get(`/prepopulated/${name}`)
    .then(res => res.data)
    .catch(err => { throw err })
}

prepopulatedService.createPrepopulated = (pname, name) => {
  return api.post(`/prepopulated/${pname}`, {
    name
  })
    .then(res => res.data)
    .catch(err => { throw err })
}

prepopulatedService.deletePrepopulated = (name, id) => {
  return api.delete(`/prepopulated/${name}/${id}`)
    .then(res => res.data)
    .catch(err => { throw err })
}

prepopulatedService.getPrepopulatedTemplate = (name) => {
  return api.get(`/prepopulated/template/${name}`)
    .then(res => res.data)
    .catch(err => { throw err })
}

prepopulatedService.updatePrepopulatedTemplate = (id, name, template) => {
  return api.patch(`/prepopulated/template/${name}`, {
    id,
    template
  })
    .then(res => res.data)
    .catch(err => { throw err })
}

export default prepopulatedService
