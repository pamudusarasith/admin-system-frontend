import { client } from './client'
import type { ApiResponse } from './client'

export interface UserStats {
  totalUsers?: number
  activeUsers?: number
  inactiveUsers?: number
}

export interface LetterStats {
  totalLetters?: number
  unassignedLetters?: number
  lettersByStatus?: Record<string, number>
  lettersByPriority?: Record<string, number>
  lettersByDivision?: Record<string, number>
}

export interface CabinetPaperStats {
  totalPapers?: number
  papersByStatus?: Record<string, number>
  papersByCategory?: Record<string, number>
  papersWithDecisions?: number
}

export interface DivisionStats {
  totalDivisions?: number
}

export interface RoleStats {
  totalRoles?: number
}

export interface DashboardStats {
  userStats?: UserStats
  letterStats?: LetterStats
  cabinetPaperStats?: CabinetPaperStats
  divisionStats?: DivisionStats
  roleStats?: RoleStats
}

export async function getDashboardStats(): Promise<
  ApiResponse<DashboardStats>
> {
  const response = await client.get('/dashboard')
  return response.data
}
