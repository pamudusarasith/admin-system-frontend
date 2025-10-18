import { client } from './client'
import type { ApiResponse } from './client'

export interface Permission {
  id: number
  name: string
  label: string
  description: string
}

export interface PermissionCategory {
  id: number
  name: string
  permissions?: Array<Permission>
  subCategories?: Array<PermissionCategory>
}

export async function getPermissions(): Promise<
  ApiResponse<Array<PermissionCategory>>
> {
  const response = await client.get('/permissions')
  return response.data
}
