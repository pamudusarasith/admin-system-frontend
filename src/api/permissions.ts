import { client } from './client'

// Permission object
export interface Permission {
  id: number
  name: string
  label: string
  description: string
  category: string | null
}

// SubCategory object
export interface PermissionSubCategory {
  id: number
  name: string
  permissions: Permission[]
}

// Top-level Category object
export interface PermissionCategory {
  id: number
  name: string
  subCategories: PermissionSubCategory[]
}

// API response shape
export interface GetPermissionsResponse {
  data: PermissionCategory[]
}

// Fetch permissions from the backend
export async function getPermissions(): Promise<PermissionCategory[]> {
  const response = await client.get<GetPermissionsResponse>('/permissions')
  return response.data.data
}