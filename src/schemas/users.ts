import * as z from 'zod'

export const createUserSchema = z.object({
  username: z
    .string()
    .min(6, 'Username must be at least 6 characters'),
  email: z.email('Invalid email format'),
  divisionId: z.number().min(1, 'Division is required'),
  roleId: z.number().min(1, 'Role is required'),
})

export type CreateUserPayload = z.infer<typeof createUserSchema>