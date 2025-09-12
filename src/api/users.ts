import { client } from './client'
import type { CreateUserPayload } from '@/schemas/users'

// Define the User interface based on the API response
export interface User {
  id: number
  username: string
  email?: string
  fullName?: string
  phoneNumber?: string
  role: string
  division: string
  isActive?: boolean
}

export async function getUsers(): Promise<Array<User>> {
  try {
    const response = await client.get('/users')
    return response.data
  } catch (error) {
    console.error('Failed to fetch users:', error)
    throw error
  }
}

export const createUser = async (data: CreateUserPayload) => {
  const res = await client.post('/users', data)
  return res.data
}

export async function getUserProfile(): Promise<User> {
  try {
    const response = await client.get('/profile')
    return response.data
  } catch (error) {
    console.error('Failed to fetch user profile:', error)
    throw error
  }
}

