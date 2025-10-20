import { client } from './client'
import type {
  CabinetPaperFormData,
  CabinetPaperSearchParams,
  CabinetPaperStatus,
} from '@/schemas'
import type { ApiResponse } from './client'
import type { User } from './users'
import type { Category } from './categories'
import type { Attachment } from './letters'

export interface CabinetPaperCategory {
  id: number
  name: string
  description?: string
}

export interface CabinetPaper {
  id: number
  referenceId: string
  subject: string
  summary?: string
  category: Category
  status: CabinetPaperStatus
  submittedByUser: User
  noOfAttachments?: number
  attachments?: Array<Attachment>
  createdAt: string
  updatedAt: string
}

export async function getCabinetPapers(
  params: CabinetPaperSearchParams,
): Promise<ApiResponse<Array<CabinetPaper>>> {
  const response = await client.get('/cabinet-papers', { params })
  return response.data
}

export async function createCabinetPaper(
  params: CabinetPaperFormData,
): Promise<ApiResponse<void>> {
  const { attachments, ...details } = params
  const formData = new FormData()
  formData.append(
    'details',
    new Blob([JSON.stringify(details)], { type: 'application/json' }),
  )
  if (attachments) {
    for (const file of attachments) {
      formData.append(`attachments`, file)
    }
  }
  const response = await client.post('/cabinet-papers', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  })
  return response.data
}

export async function getCabinetPaperById(
  id: number,
): Promise<ApiResponse<CabinetPaper>> {
  const response = await client.get(`/cabinet-papers/${id}`)
  return response.data
}

export async function updateCabinetPaper(
  id: number,
  params: CabinetPaperFormData,
): Promise<ApiResponse<void>> {
  const { attachments, ...details } = params
  const formData = new FormData()
  formData.append(
    'details',
    new Blob([JSON.stringify(details)], { type: 'application/json' }),
  )
  if (attachments) {
    for (const file of attachments) {
      formData.append(`attachments`, file)
    }
  }
  const response = await client.put(`/cabinet-papers/${id}`, formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  })
  return response.data
}

export async function deleteCabinetPaper(
  id: number,
): Promise<ApiResponse<void>> {
  const response = await client.delete(`/cabinet-papers/${id}`)
  return response.data
}
