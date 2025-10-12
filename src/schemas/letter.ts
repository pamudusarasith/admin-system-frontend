import * as z from 'zod'

export const modeOfArrivalEnum = z.enum([
  'REGISTERED_POST',
  'UNREGISTERED_POST',
  'EMAIL',
  'WHATSAPP',
  'HAND_DELIVERED',
  'FAX',
  'OTHER',
])

export const letterPriorityEnum = z.enum(['NORMAL', 'HIGH', 'URGENT'])

export const letterStatusEnum = z.enum([
  'NEW',
  'ASSIGNED_TO_DIVISION',
  'PENDING_ACCEPTANCE',
  'ASSIGNED_TO_OFFICER',
  'RETURNED_FROM_OFFICER',
  'RETURNED_FROM_DIVISION',
  'CLOSED',
])

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
  mode_of_arrival: modeOfArrivalEnum,
  subject: z.string().min(1),
  content: z.string().optional(),
  priority: letterPriorityEnum,
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
  status: letterStatusEnum.optional().catch(undefined),
  priority: letterPriorityEnum.optional().catch(undefined),
  modeOfArrival: modeOfArrivalEnum.optional().catch(undefined),
  sender: z.string().optional().catch(undefined),
  receiver: z.string().optional().catch(undefined),
  assignedUser: z.string().optional().catch(undefined),
  assignedDivision: z.string().optional().catch(undefined),
  sentDateFrom: z.string().optional().catch(undefined),
  sentDateTo: z.string().optional().catch(undefined),
  receivedDateFrom: z.string().optional().catch(undefined),
  receivedDateTo: z.string().optional().catch(undefined),
})

export type ModeOfArrival = z.infer<typeof modeOfArrivalEnum>
export type LetterPriority = z.infer<typeof letterPriorityEnum>
export type LetterStatus = z.infer<typeof letterStatusEnum>
export type LetterFormData = z.infer<typeof createLetterSchema>
export type AddNoteFormData = z.infer<typeof addNoteSchema>
export type LetterSearchParams = z.infer<typeof letterSearchParamsSchema>
