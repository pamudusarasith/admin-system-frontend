import { client } from './client'
import type { ApiResponse } from './client'
import type { CreateUserPayload, UpdateUserProfilePayload } from '@/schemas'

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
  accountSetupRequired?: boolean
}

interface GetUsersParams {
  query?: string
  divisionId?: number
  page?: number
  pageSize?: number
}

export async function getUsers(
  params: GetUsersParams,
): Promise<ApiResponse<Array<User>>> {
  try {
    const response = await client.get('/users', { params })
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
    return response.data.data
  } catch (error) {
    console.error('Failed to fetch user profile:', error)
    throw error
  }
}

export async function updateProfile(
  data: UpdateUserProfilePayload,
): Promise<void> {
  try {
    const response = await client.put(`/profile`, data)
    return response.data
  } catch (error) {
    console.error('Failed to update profile:', error)
    throw error
  }
}
