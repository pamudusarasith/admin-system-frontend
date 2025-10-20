import * as z from 'zod'

export const createUserSchema = z.object({
  username: z.string().min(6, 'Username must be at least 6 characters'),
  email: z.email('Invalid email format'),
  divisionId: z.number().min(1, 'Division is required'),
  roleId: z.number().min(1, 'Role is required'),
})

export type CreateUserPayload = z.infer<typeof createUserSchema>

export const updateUserProfileSchema = z.object({
  fullName: z.string().trim().min(1, 'Full name is required'),
  email: z.email('Invalid email format'),
  phoneNumber: z
    .string()
    .length(10, 'Phone number must be exactly 10 digits')
    .regex(/^\d{10}$/, 'Phone number must contain only digits'),
})

export type UpdateUserProfilePayload = z.infer<typeof updateUserProfileSchema>

export const accountSetupSchema = z.object({
  fullName: z.string().trim().min(1, 'Full name is required'),
  email: z.email('Invalid email format'),
  phoneNumber: z
    .string()
    .length(10, 'Phone number must be exactly 10 digits')
    .regex(/^\d{10}$/, 'Phone number must contain only digits'),
  oldPassword: z.string(),
  newPassword: z.string().min(6, 'New password must be at least 6 characters'),
})

export type AccountSetupPayload = z.infer<typeof accountSetupSchema>

export const userSearchParamsSchema = z.object({
  query: z.string().optional(),
  role: z.string().optional(),
  division: z.string().optional(),
  page: z.number().min(0).optional(),
  pageSize: z.number().min(1).max(100).optional(),
})

export type UserSearchParams = z.infer<typeof userSearchParamsSchema>
