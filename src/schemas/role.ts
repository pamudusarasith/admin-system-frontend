import * as z from 'zod'

export const roleFormDataSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  description: z.string().optional(),
  permissions: z
    .array(z.string())
    .min(1, 'At least one permission is required'),
})

export const roleSearchParamsSchema = z.object({
  page: z.number().min(0).optional().catch(undefined),
  pageSize: z.number().min(1).max(100).optional().catch(undefined),
  query: z.string().optional().catch(undefined),
})

export type RoleFormData = z.infer<typeof roleFormDataSchema>
export type RoleSearchParams = z.infer<typeof roleSearchParamsSchema>
