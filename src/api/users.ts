import { client } from './client'

export async function getUsers(): Promise<any> {
  try {
    const response = await client.get('/users')
    return response.data
  } catch (error) {
    console.error('Failed to fetch users:', error)
    throw error
  }
}

export async function createUser(userData: any): Promise<any> {
  try {
    const response = await client.post('/users', userData)
    return response.data
  } catch (error) {
    console.error('Failed to create user:', error)
    throw error
  }
}
