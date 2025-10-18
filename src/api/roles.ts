import { client } from './client'
import type { ApiResponse } from './client'
import type { RoleFormData } from '@/schemas'

export interface Role {
  id: string
  name: string
  description: string
  permissions: Array<string>
  userCount?: number
}

interface GetRolesParams {
  query?: string
  page?: number
  pageSize?: number
}

export async function getRoles(
  params: GetRolesParams,
): Promise<ApiResponse<Array<Role>>> {
  const response = await client.get('/roles', { params })
  return response.data
}

export async function createRole(
  roleData: RoleFormData,
): Promise<ApiResponse<any>> {
  const response = await client.post('/roles', roleData)
  return response.data
}

export async function updateRole(
  id: string,
  roleData: RoleFormData,
): Promise<ApiResponse<any>> {
  const response = await client.put(`/roles/${id}`, roleData)
  return response.data
}

export async function deleteRole(id: string): Promise<ApiResponse<any>> {
  const response = await client.delete(`/roles/${id}`)
  return response.data
}
