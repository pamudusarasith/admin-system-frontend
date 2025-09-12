import { client } from './client'
import type { LetterFormData } from '@/schemas/letter'
import type { Division } from './divisions'
import type { User } from './users'

export interface SenderDetails {
  name: string
  address?: string
  email?: string
  phoneNumber?: string
}

export interface ReceiverDetails {
  name: string
  designation?: string
  divisionName?: string
}

export interface Attachment {
  id: string
  fileName: string
  fileType: string
  url: string
  createdAt: string
}

export interface ChangeStatusEventDetails {
  newStatus: string
}

export interface LetterEvent {
  id: string
  user: {
    fullName: string
    role: string
    division: string
  }
  eventType:
    | 'ADD_NOTE'
    | 'ADD_ATTACHMENT'
    | 'REMOVE_ATTACHMENT'
    | 'REPLY'
    | 'CHANGE_STATUS'
    | 'CHANGE_PRIORITY'
    | 'UPDATE_DETAILS'
  eventDetails?: ChangeStatusEventDetails | Record<string, any>
  createdAt: string
}

export interface Letter {
  id: number
  reference: string
  senderDetails: SenderDetails
  receiverDetails: ReceiverDetails
  sentDate?: string
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
  content?: string
  priority: 'NORMAL' | 'HIGH' | 'URGENT'
  status:
    | 'NEW'
    | 'ASSIGNED_TO_DIVISION'
    | 'PENDING_ACCEPTANCE'
    | 'ASSIGNED_TO_OFFICER'
    | 'RETURNED_FROM_OFFICER'
    | 'RETURNED_FROM_DIVISION'
    | 'CLOSED'
  assignedDivision?: Division
  assignedUser?: User
  isAcceptedByUser?: boolean
  noOfAttachments?: number
  attachments?: Array<Attachment>
  events?: Array<LetterEvent>
  createdAt: string
  updatedAt: string
}

export interface LettersApiResponse {
  data: Array<Letter>
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

export async function getLetters(
  params: GetLettersParams = {},
): Promise<LettersApiResponse> {
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

export async function getLetterById(letterId: number): Promise<Letter> {
  try {
    const response = await client.get(`/letters/${letterId}`)
    return response.data
  } catch (error) {
    console.error(`Failed to fetch letter with ID ${letterId}:`, error)
    throw error
  }
}
