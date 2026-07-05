export const API_BASE = import.meta.env.VITE_API_BASE || 'http://localhost:4000/api'

export const request = async (path, options = {}) => {
  const url = `${API_BASE}${path}`
  const token = localStorage.getItem('auth_token')
  const headers = {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...(options.headers || {}),
  }

  const response = await fetch(url, { ...options, headers })
  const contentType = response.headers.get('content-type') || ''
  const data = contentType.includes('application/json') ? await response.json() : null

  if (!response.ok) {
    if (response.status === 401) {
      localStorage.removeItem('auth_token')
      localStorage.removeItem('auth_user')
      if (window.location.pathname !== '/loginregistrationupdatedowl') {
        window.location.href = '/loginregistrationupdatedowl'
      }
    }
    const message = data?.message || 'Request failed'
    throw new Error(message)
  }

  return data
}

export const uploadFormData = async (path, formData) => {
  const url = `${API_BASE}${path}`
  const token = localStorage.getItem('auth_token')
  const headers = {
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  }
  const response = await fetch(url, { method: 'POST', headers, body: formData })
  const contentType = response.headers.get('content-type') || ''
  const data = contentType.includes('application/json') ? await response.json() : null

  if (!response.ok) {
    if (response.status === 401) {
      localStorage.removeItem('auth_token')
      localStorage.removeItem('auth_user')
      if (window.location.pathname !== '/loginregistrationupdatedowl') {
        window.location.href = '/loginregistrationupdatedowl'
      }
    }
    const message = data?.message || 'Request failed'
    throw new Error(message)
  }

  return data
}
