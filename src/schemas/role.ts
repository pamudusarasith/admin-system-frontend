import * as z from 'zod'

export const roleFormDataSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  description: z.string().optional(),
  permissions: z
    .array(z.string())
    .min(1, 'At least one permission is required'),
})

export type RoleFormData = z.infer<typeof roleFormDataSchema>
