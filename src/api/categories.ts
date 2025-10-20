import { client } from './client'
import type { ApiResponse } from './index'

export interface Category {
  id: number
  name: string
  description?: string
}

export interface CategoryFormData {
  name: string
  description?: string
}

interface GetCategoriesParams {
  query?: string
  page?: number
  pageSize?: number
}

export async function getCategories(
  params?: GetCategoriesParams,
): Promise<ApiResponse<Array<Category>>> {
  try {
    const response = await client.get('/cabinet-papers/categories', {
      params: params,
    })
    return response.data
  } catch (error) {
    console.error('Failed to fetch categories:', error)
    throw error
  }
}

export async function createCategory(
  data: CategoryFormData,
): Promise<ApiResponse<any>> {
  try {
    const response = await client.post('/cabinet-papers/categories', data)
    return response.data
  } catch (error) {
    console.error('Failed to create category:', error)
    throw error
  }
}

export async function updateCategory(
  id: string,
  data: CategoryFormData,
): Promise<ApiResponse<any>> {
  try {
    const response = await client.put(`/cabinet-papers/categories/${id}`, data)
    return response.data
  } catch (error) {
    console.error('Failed to update category:', error)
    throw error
  }
}

export async function deleteCategory(id: string): Promise<ApiResponse<any>> {
  try {
    const response = await client.delete(`/cabinet-papers/categories/${id}`)
    return response.data
  } catch (error) {
    console.error('Failed to delete category:', error)
    throw error
  }
}
