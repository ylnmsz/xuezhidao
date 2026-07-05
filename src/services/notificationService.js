import { request } from './api.js'

export const listNotifications = (params = {}) => {
  const qs = new URLSearchParams(params).toString()
  return request(`/notifications${qs ? `?${qs}` : ''}`)
}

export const markNotificationAsRead = (id) =>
  request(`/notifications/${id}`, {
    method: 'PUT',
    body: JSON.stringify({ read_at: new Date().toISOString() }),
  })
