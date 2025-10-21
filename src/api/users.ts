import { client } from './client'
import type { ApiResponse } from './client'
import type {
  AccountSetupPayload,
  CreateUserPayload,
  UpdateUserPayload,
  UpdateUserProfilePayload,
} from '@/schemas'

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
  roleName?: string
  divisionName?: string
  divisionId?: number
  assignableOnly?: boolean
  page?: number
  pageSize?: number
}

export async function getUsers(
  params: GetUsersParams,
): Promise<ApiResponse<Array<User>>> {
  const response = await client.get('/users', { params })
  return response.data
}

export async function createUser(
  data: CreateUserPayload,
): Promise<ApiResponse<void>> {
  const response = await client.post('/users', data)
  return response.data
}

export async function updateUser(
  userId: number,
  data: UpdateUserPayload,
): Promise<ApiResponse<void>> {
  const response = await client.put(`/users/${userId}`, data)
  return response.data
}

export async function deleteUser(userId: number): Promise<ApiResponse<void>> {
  const response = await client.delete(`/users/${userId}`)
  return response.data
}

export async function resetUserPassword(
  userId: number,
): Promise<ApiResponse<void>> {
  const response = await client.post(`/users/${userId}/reset-password`)
  return response.data
}

export async function getUserProfile(): Promise<ApiResponse<User>> {
  const response = await client.get('/profile')
  return response.data
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

export async function accountSetup(
  data: AccountSetupPayload,
): Promise<ApiResponse<void>> {
  const response = await client.post(`/account-setup`, data)
  return response.data
}
