import { request } from './api.js'
import { saveUser } from './userService.js'

export const login = async ({ email, password }) => {
  const data = await request('/auth/login', {
    method: 'POST',
    body: JSON.stringify({ email, password }),
  })
  saveUser(data?.user)
  return data
}

export const register = async ({ name, email, password, role }) => {
  const data = await request('/auth/register', {
    method: 'POST',
    body: JSON.stringify({ name, email, password, role }),
  })
  saveUser(data?.user)
  return data
}
