import client from './client'

export const register = async (email, password, name) => {
  const response = await client.post('/auth/register', {
    email,
    password,
    name,
  })
  return response.data
}

export const login = async (email, password) => {
  const response = await client.post('/auth/login', {
    email,
    password,
  })
  return response.data
}

export const getMe = async () => {
  const response = await client.get('/me')
  return response.data
}

