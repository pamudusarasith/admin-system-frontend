import { client } from './client'

export async function login(
  username: string,
  password: string,
): Promise<{ access_token: string }> {
  try {
    const response = await client.post('/login', { username, password })
    return response.data
  } catch (error) {
    console.error('Login failed:', error)
    throw error
  }
}
