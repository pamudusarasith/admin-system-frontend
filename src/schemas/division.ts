import * as z from 'zod'

export const divisionSchema = z.object({
  name: z.string().trim().min(1, { message: 'Division name is required' }),
  description: z.string().trim().optional(),
})

export type DivisionFormData = z.infer<typeof divisionSchema>
