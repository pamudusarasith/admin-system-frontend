import { client } from './client'
import type { ApiResponse } from './client'
import type { Division } from './divisions'
import type { User } from './users'
import type { AddNoteFormData, LetterFormData } from '@/schemas'

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
  previousStatus?: string
  division?: Division
  user?: User
  reason?: string
}

export interface AddNoteEventDetails {
  content: string
  attachments?: Array<Attachment>
}

export interface LetterEvent {
  id: string
  user: User
  eventType:
    | 'ADD_NOTE'
    | 'ADD_ATTACHMENT'
    | 'REMOVE_ATTACHMENT'
    | 'REPLY'
    | 'CHANGE_STATUS'
    | 'CHANGE_PRIORITY'
    | 'UPDATE_DETAILS'
  eventDetails?:
    | ChangeStatusEventDetails
    | AddNoteEventDetails
    | Record<string, any>
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

export interface GetLettersParams {
  page?: number
  pageSize?: number
  query?: string
}

export async function getLetters(
  params: GetLettersParams = {},
): Promise<ApiResponse<Array<Letter>>> {
  try {
    const { page = 0, pageSize = 10, ...otherParams } = params
    const response = await client.get('/letters', {
      params: {
        page,
        pageSize,
        ...otherParams,
      },
    })
    return response.data
  } catch (error) {
    console.error('Failed to fetch letters:', error)
    throw error
  }
}

export async function createLetter(
  letterData: LetterFormData,
): Promise<ApiResponse<any>> {
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

export async function getLetterById(
  letterId: number,
): Promise<ApiResponse<Letter>> {
  try {
    const response = await client.get(`/letters/${letterId}`)
    return response.data
  } catch (error) {
    console.error(`Failed to fetch letter with ID ${letterId}:`, error)
    throw error
  }
}

export async function addNote(
  letterId: number,
  noteData: AddNoteFormData,
): Promise<ApiResponse<any>> {
  try {
    const { content, attachments } = noteData
    const formData = new FormData()
    formData.append('content', content)
    attachments.forEach((file) => {
      formData.append(`attachments`, file)
    })
    const response = await client.post(`/letters/${letterId}/notes`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    })
    return response.data
  } catch (error) {
    console.error(`Failed to add note to letter with ID ${letterId}:`, error)
    throw error
  }
}

export async function sendReply(
  letterId: number,
  content: string,
  attachments?: Array<File>,
): Promise<ApiResponse<any>> {
  try {
    const formData = new FormData()
    formData.append('content', content)
    attachments?.forEach((file) => {
      formData.append('attachments', file)
    })
    const response = await client.post(`/letters/${letterId}/reply`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    })
    return response.data
  } catch (error) {
    console.error(`Failed to send reply for letter with ID ${letterId}:`, error)
    throw error
  }
}

export async function assignDivision(
  letterId: number,
  divisionId: number,
): Promise<ApiResponse<any>> {
  try {
    const response = await client.put(`/letters/${letterId}/division`, {
      divisionId,
    })
    return response.data
  } catch (error) {
    console.error(
      `Failed to assign division to letter with ID ${letterId}:`,
      error,
    )
    throw error
  }
}

export async function assignUser(
  letterId: number,
  userId: number,
): Promise<ApiResponse<any>> {
  try {
    const response = await client.put(`/letters/${letterId}/user`, { userId })
    return response.data
  } catch (error) {
    console.error(`Failed to assign user to letter with ID ${letterId}:`, error)
    throw error
  }
}

export async function returnFromDivision(
  letterId: number,
  reason: string,
): Promise<ApiResponse<any>> {
  try {
    const response = await client.delete(`/letters/${letterId}/division`, {
      data: { reason },
    })
    return response.data
  } catch (error) {
    console.error(
      `Failed to return letter with ID ${letterId} from division:`,
      error,
    )
    throw error
  }
}

export async function acceptLetter(
  letterId: number,
): Promise<ApiResponse<any>> {
  try {
    const response = await client.patch(
      `/letters/${letterId}/user`,
      undefined,
      {
        params: { action: 'accept' },
      },
    )
    return response.data
  } catch (error) {
    console.error(`Failed to accept letter with ID ${letterId}:`, error)
    throw error
  }
}

export async function markAsComplete(
  letterId: number,
): Promise<ApiResponse<any>> {
  try {
    // Use the same endpoint pattern as acceptLetter but with action 'markComplete'
    const response = await client.patch(`/letters/${letterId}`, undefined, {
      params: { action: 'markComplete' },
    })
    return response.data
  } catch (error) {
    console.error(
      `Failed to mark letter with ID ${letterId} as complete:`,
      error,
    )
    throw error
  }
}

export async function reopenLetter(
  letterId: number,
): Promise<ApiResponse<any>> {
  try {
    const response = await client.patch(`/letters/${letterId}`, undefined, {
      params: { action: 'reopen' },
    })
    return response.data
  } catch (error) {
    console.error(`Failed to reopen letter with ID ${letterId}:`, error)
    throw error
  }
}
