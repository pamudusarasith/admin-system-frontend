import * as z from 'zod'

const attachmentsSchema = z.array(
  z
    .file()
    .max(200 * 1024 * 1024, { error: 'Each file must be less than 200MB' })
    .mime(
      [
        'image/png',
        'image/jpeg',
        'application/pdf',
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        'text/plain',
      ],
      { error: 'Unsupported file type' },
    ),
)

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
  attachments: attachmentsSchema.optional(),
})

export type CabinetPaperStatus = z.infer<typeof cabinetPaperStatusEnum>
export type CabinetPaperFormData = z.infer<typeof cabinetPaperFormDataSchema>
