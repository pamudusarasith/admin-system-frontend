import { client } from './client'
import type { CabinetPaperFormData, CabinetPaperStatus } from '@/schemas'
import type { ApiResponse } from './client'
import type { User } from './users'
import type { Category } from './categories'

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
  createdAt: string
  updatedAt: string
}

interface GetCabinetPapersProps {
  page?: number
  pageSize?: number
}

export async function getCabinetPapers(
  params: GetCabinetPapersProps,
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
