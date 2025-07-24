import { client } from './client'

export interface Division {
  id: string
  name: string
  description: string
}

export interface CreateDivisionRequest {
  name: string
  description: string
}

export interface UpdateDivisionRequest {
  name?: string
  description?: string
}

export async function getDivisions(): Promise<Division[]> {
  try {
    const response = await client.get('/divisions')
    return response.data
  } catch (error) {
    console.error('Failed to fetch divisions:', error)
    throw error
  }
}

export async function createDivision(
  divisionData: CreateDivisionRequest,
): Promise<Division> {
  try {
    const response = await client.post('/divisions', divisionData)
    return response.data
  } catch (error) {
    console.error('Failed to create division:', error)
    throw error
  }
}

export async function updateDivision(
  id: string,
  divisionData: UpdateDivisionRequest,
): Promise<Division> {
  try {
    const response = await client.put(`/divisions/${id}`, divisionData)
    return response.data
  } catch (error) {
    console.error('Failed to update division:', error)
    throw error
  }
}

export async function deleteDivision(id: string): Promise<void> {
  try {
    await client.delete(`/divisions/${id}`)
  } catch (error) {
    console.error('Failed to delete division:', error)
    throw error
  }
}
