import * as z from 'zod'

export const createLetterSchema = z.object({
  reference: z.string().min(1),
  sender_details: z.object({
    name: z.string().min(1),
    address: z.string().optional(),
    email: z.email().optional(),
    phone_number: z.string().optional(),
  }),
  receiver_details: z.object({
    name: z.string().min(1),
    designation: z.string().optional(),
    division_name: z.string().optional(),
  }),
  sent_date: z.iso.date().optional(),
  received_date: z.iso.date(),
  mode_of_arrival: z.enum([
    'REGISTERED_POST',
    'UNREGISTERED_POST',
    'EMAIL',
    'WHATSAPP',
    'HAND_DELIVERED',
    'FAX',
    'OTHER',
  ]),
  subject: z.string().min(1),
  content: z.string().optional(),
  priority: z.enum(['NORMAL', 'HIGH', 'URGENT']),
  attachments: z.array(z.file()).optional(),
})

export const addNoteSchema = z.object({
  content: z.string().trim().min(1, { error: 'Note content is required' }),
  attachments: z.array(
    z
      .file()
      .max(10 * 1024 * 1024, { error: 'Each file must be less than 10MB' })
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
  ),
})

export const letterSearchParamsSchema = z.object({
  page: z.number().min(1).optional().catch(undefined),
  pageSize: z.number().min(1).max(100).optional().catch(undefined),
  query: z.string().optional().catch(undefined),
})

export type LetterFormData = z.infer<typeof createLetterSchema>
export type AddNoteFormData = z.infer<typeof addNoteSchema>
export type LetterSearchParams = z.infer<typeof letterSearchParamsSchema>
