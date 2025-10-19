import { client } from './client'
import type { CabinetPaperFormData, CabinetPaperStatus } from '@/schemas'
import type { ApiResponse } from './client'
import type { User } from './users'

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
  category: CabinetPaperCategory
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
  const response = await client.post('/cabinet-papers', params)
  return response.data
}
