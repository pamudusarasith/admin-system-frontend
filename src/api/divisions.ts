import { client } from './client'
import type { DivisionFormData } from '@/schemas'
import type { ApiResponse } from './client'

export interface Division {
  id: number
  name: string
  description?: string
}

interface GetDivisionsParams {
  query?: string
  page?: number
  pageSize?: number
}

export async function getDivisions(
  params?: GetDivisionsParams,
): Promise<ApiResponse<Array<Division>>> {
  try {
    const response = await client.get('/divisions', {
      params: params,
    })
    return response.data.data
  } catch (error) {
    console.error('Failed to fetch divisions:', error)
    throw error
  }
}

export async function createDivision(
  data: DivisionFormData,
): Promise<ApiResponse<any>> {
  try {
    const response = await client.post('/divisions', data)
    return response.data
  } catch (error) {
    console.error('Failed to create division:', error)
    throw error
  }
}

export async function updateDivision(
  id: string,
  data: DivisionFormData,
): Promise<ApiResponse<any>> {
  try {
    const response = await client.put(`/divisions/${id}`, data)
    return response.data
  } catch (error) {
    console.error('Failed to update division:', error)
    throw error
  }
}

export async function deleteDivision(id: string): Promise<ApiResponse<any>> {
  try {
    const response = await client.delete(`/divisions/${id}`)
    return response.data
  } catch (error) {
    console.error('Failed to delete division:', error)
    throw error
  }
}
