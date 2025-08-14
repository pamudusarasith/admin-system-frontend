import { client } from './client'
import type { LetterFormData } from '@/schemas/letter'

export interface LetterResponse {
  id: number
  reference: string
  senderDetails: {
    name: string
    address: string | null
    email: string | null
    phoneNumber: string | null
  }
  receiverDetails: {
    name: string
    designation: string | null
    divisionName: string | null
  }
  sentDate: string | null
  receivedDate: string
  modeOfArrival:
    | 'REGISTERED_POST'
    | 'UNREGISTERED_POST'
    | 'EMAIL'
    | 'WHATSAPP'
    | 'HAND_DELIVERED'
    | 'FAX'
    | 'OTHER'
  subject: string
  content: string | null
  priority: 'NORMAL' | 'HIGH' | 'URGENT'
  status:
    | 'NEW'
    | 'ASSIGNED_TO_DIVISION'
    | 'PENDING_ACCEPTANCE'
    | 'ASSIGNED_TO_OFFICER'
    | 'RETURNED_FROM_OFFICER'
    | 'RETURNED_FROM_DIVISION'
    | 'CLOSED'
  assignedDivision: {
    id: number
    name: string
    description: string
  } | null
  assignedUser: {
    id: number
    username: string
    email: string | null
    fullName: string
    phoneNumber: string | null
    role: string
    division: string
    isActive: boolean
  } | null
  isAcceptedByUser: boolean | null
  noOfAttachments: number
}

export interface LettersApiResponse {
  data: Array<LetterResponse>
  pagination: {
    page: number
    itemsPerPage: number
    totalPages: number
  }
}

export interface GetLettersParams {
  page?: number
  itemsPerPage?: number
  status?: string
  priority?: string
  search?: string
}

export async function getLetters(params: GetLettersParams = {}): Promise<LettersApiResponse> {
  try {
    const { page = 0, itemsPerPage = 10, ...otherParams } = params
    const response = await client.get('/letters', {
      params: {
        page,
        itemsPerPage,
        ...otherParams,
      },
    })
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
