import { request } from './api.js'

export const listAssignments = (params = {}) => {
  const qs = new URLSearchParams(params).toString()
  return request(`/assignments${qs ? '?' + qs : ''}`)
}

export const getAssignment = (id) => request(`/assignments/${id}`)

export const createAssignment = (data) =>
  request('/assignments', { method: 'POST', body: JSON.stringify(data) })

export const updateAssignment = (id, data) =>
  request(`/assignments/${id}`, { method: 'PATCH', body: JSON.stringify(data) })

export const deleteAssignment = (id) => request(`/assignments/${id}`, { method: 'DELETE' })
