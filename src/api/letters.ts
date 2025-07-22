import { client } from './client'

export async function getLetters(): Promise<any> {
  try {
    const response = await client.get('/letters')
    return response.data
  } catch (error) {
    console.error('Failed to fetch letters:', error)
    throw error
  }
}

export async function createLetter(letterData: any): Promise<any> {
  try {
    const response = await client.post('/letters', letterData)
    return response.data
  } catch (error) {
    console.error('Failed to create letter:', error)
    throw error
  }
}