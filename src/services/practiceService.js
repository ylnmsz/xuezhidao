import { request } from './api.js'

export const submitPractice = (payload) =>
  request('/practice/submit', {
    method: 'POST',
    body: JSON.stringify(payload),
  })
