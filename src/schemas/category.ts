import * as z from 'zod'

export const categoryFormDataSchema = z.object({
  name: z.string().trim().min(1, 'Category name is required'),
  description: z.string().trim().optional(),
})

export type CategoryFormData = z.infer<typeof categoryFormDataSchema>
