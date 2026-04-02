import { request, uploadFormData } from './api.js'

export const createQuestion = (payload) =>
  request('/questions', {
    method: 'POST',
    body: JSON.stringify(payload),
  })

export const uploadQuestionsCsv = (file) => {
  const formData = new FormData()
  formData.append('file', file)
  return uploadFormData('/questions/batch', formData)
}
