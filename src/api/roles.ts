import { client } from './client'

// Types for Role API responses
export interface Role {
  id: string
  name: string
  description: string
  permissions: string[]
  userCount?: number
  createdDate: string
  isActive: boolean
}

export interface CreateRoleRequest {
  name: string
  description: string
  permissions: string[]
  isActive?: boolean
}

export interface UpdateRoleRequest {
  name?: string
  description?: string
  permissions?: string[]
  isActive?: boolean
}

export async function getRoles(): Promise<Role[]> {
  try {
    const response = await client.get('/roles')
    return response.data
  } catch (error) {
    console.error('Failed to fetch roles:', error)
    throw error
  }
}

export async function getRoleById(id: string): Promise<Role> {
  try {
    const response = await client.get(`/roles/${id}`)
    return response.data
  } catch (error) {
    console.error('Failed to fetch role:', error)
    throw error
  }
}

export async function createRole(roleData: CreateRoleRequest): Promise<Role> {
  try {
    const response = await client.post('/roles', roleData)
    return response.data
  } catch (error) {
    console.error('Failed to create role:', error)
    throw error
  }
}

export async function updateRole(id: string, roleData: UpdateRoleRequest): Promise<Role> {
  try {
    const response = await client.put(`/roles/${id}`, roleData)
    return response.data
  } catch (error) {
    console.error('Failed to update role:', error)
    throw error
  }
}

export async function deleteRole(id: string): Promise<void> {
  try {
    await client.delete(`/roles/${id}`)
  } catch (error) {
    console.error('Failed to delete role:', error)
    throw error
  }
}

export async function assignRoleToUser(userId: string, roleId: string): Promise<void> {
  try {
    await client.post(`/users/${userId}/roles`, { roleId })
  } catch (error) {
    console.error('Failed to assign role to user:', error)
    throw error
  }
}

export async function removeRoleFromUser(userId: string, roleId: string): Promise<void> {
  try {
    await client.delete(`/users/${userId}/roles/${roleId}`)
  } catch (error) {
    console.error('Failed to remove role from user:', error)
    throw error
  }
}
