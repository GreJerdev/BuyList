import client from './client'

export const getLists = async () => {
  const response = await client.get('/lists')
  return response.data
}

export const getList = async (listId) => {
  const response = await client.get(`/lists/${listId}`)
  return response.data
}

export const createList = async (name, description) => {
  const response = await client.post('/lists', { name, description })
  return response.data
}

export const updateList = async (listId, data) => {
  const response = await client.patch(`/lists/${listId}`, data)
  return response.data
}

export const deleteList = async (listId) => {
  await client.delete(`/lists/${listId}`)
}

export const getListMembers = async (listId) => {
  const response = await client.get(`/lists/${listId}/members`)
  return response.data
}

export const shareList = async (listId, userEmail, role) => {
  const response = await client.post(`/lists/${listId}/share`, {
    user_email: userEmail,
    role,
  })
  return response.data
}

export const removeMember = async (listId, userId) => {
  await client.delete(`/lists/${listId}/members/${userId}`)
}

export const addItem = async (listId, itemData) => {
  const response = await client.post(`/lists/${listId}/items`, itemData)
  return response.data
}

export const updateItem = async (listId, itemId, itemData) => {
  const response = await client.patch(`/lists/${listId}/items/${itemId}`, itemData)
  return response.data
}

export const deleteItem = async (listId, itemId) => {
  await client.delete(`/lists/${listId}/items/${itemId}`)
}

export const suggestCategory = async (itemName, notes) => {
  const response = await client.post('/assist/suggest-category', {
    item_name: itemName,
    notes,
  })
  return response.data
}

