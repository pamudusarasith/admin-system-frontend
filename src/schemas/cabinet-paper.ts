import * as z from 'zod'

export const cabinetPaperStatusEnum = z.enum([
  'DRAFT',
  'SUBMITTED',
  'APPROVED_FOR_CABINET',
  'CONSIDERED',
  'REJECTED',
  'ARCHIVED',
])

export const cabinetPaperFormDataSchema = z.object({
  referenceId: z.string().trim().min(1, 'Reference ID is required'),
  subject: z.string().trim().min(1, 'Subject is required'),
  summary: z.string().trim().optional(),
  categoryId: z.number().min(1, 'Category is required'),
  status: cabinetPaperStatusEnum,
})

export type CabinetPaperStatus = z.infer<typeof cabinetPaperStatusEnum>
export type CabinetPaperFormData = z.infer<typeof cabinetPaperFormDataSchema>
