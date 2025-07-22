import { client } from './client'

export interface Division {
  id: string
  name: string
  description: string
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
