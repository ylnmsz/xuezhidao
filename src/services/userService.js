import { request, uploadFormData } from './api.js'

export const getStoredUser = () => {
  const raw = localStorage.getItem('auth_user')
  if (!raw) return null
  try {
    return JSON.parse(raw)
  } catch {
    return null
  }
}

export const saveUser = (user) => {
  if (!user) return
  localStorage.setItem('auth_user', JSON.stringify(user))
}

export const clearUser = () => {
  localStorage.removeItem('auth_user')
  localStorage.removeItem('auth_token')
}

export const getMe = () => request('/users/me')

export const updateMe = (payload) =>
  request('/users/me', {
    method: 'PUT',
    body: JSON.stringify(payload),
  })

export const uploadAvatar = (file) => {
  const formData = new FormData()
  formData.append('avatar', file)
  return uploadFormData('/uploads/avatar', formData)
}
