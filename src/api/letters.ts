import { client } from './client'
import type { LetterFormData } from '@/schemas/letter'

export async function getLetters(): Promise<any> {
  try {
    const response = await client.get('/letters')
    return response.data
  } catch (error) {
    console.error('Failed to fetch letters:', error)
    throw error
  }
}

export async function createLetter(letterData: LetterFormData): Promise<any> {
  try {
    const { attachments, ...details } = letterData
    const formData = new FormData()
    formData.append(
      'details',
      new Blob([JSON.stringify(details)], { type: 'application/json' }),
    )
    attachments?.forEach((file) => {
      formData.append(`attachments`, file)
    })
    const response = await client.post('/letters', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    })
    return response.data
  } catch (error) {
    console.error('Failed to create letter:', error)
    throw error
  }
}
