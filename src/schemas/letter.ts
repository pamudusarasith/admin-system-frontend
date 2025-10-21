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

export const createLetterSchema = z
  .object({
    reference: z
      .string()
      .min(1, 'Reference number is required')
      .trim()
      .nonempty('Reference number cannot be empty'),
    sender_details: z.object({
      name: z
        .string()
        .min(1, 'Sender name is required')
        .trim()
        .nonempty('Sender name cannot be empty'),
      address: z.string().optional(),
      email: z.email('Invalid email format').optional().or(z.literal('')),
      phone_number: z.string().optional(),
    }),
    receiver_details: z.object({
      name: z
        .string()
        .min(1, 'Receiver name is required')
        .trim()
        .nonempty('Receiver name cannot be empty'),
      designation: z.string().optional(),
      division_name: z.string().optional(),
    }),
    sent_date: z.string().optional().or(z.literal('')),
    received_date: z
      .string()
      .min(1, 'Received date is required')
      .refine((date) => !Number.isNaN(Date.parse(date)), {
        message: 'Invalid date format',
      }),
    mode_of_arrival: modeOfArrivalEnum,
    subject: z
      .string()
      .min(1, 'Subject is required')
      .trim()
      .nonempty('Subject cannot be empty'),
    content: z.string().optional(),
    priority: letterPriorityEnum,
    attachments: z
      .array(
        z
          .file()
          .refine((file) => file.size <= 10 * 1024 * 1024, {
            message: 'Each file must be less than 10MB',
          })
          .refine(
            (file) =>
              [
                'image/png',
                'image/jpeg',
                'application/pdf',
                'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
              ].includes(file.type),
            {
              message: 'Only PNG, JPEG, PDF, and DOCX files are allowed',
            },
          ),
      )
      .optional(),
  })
  .refine(
    (data) => {
      // If sent_date is provided and not empty, validate it's before or equal to received_date
      if (data.sent_date && data.sent_date.trim() !== '') {
        const sentDate = new Date(data.sent_date)
        const receivedDate = new Date(data.received_date)

        // Check if sent_date is valid
        if (Number.isNaN(sentDate.getTime())) {
          return false
        }

        // Sent date should not be after received date
        return sentDate <= receivedDate
      }
      return true
    },
    {
      message: 'Sent date cannot be after received date',
      path: ['sent_date'],
    },
  )

export const addNoteSchema = z.object({
  content: z
    .string()
    .trim()
    .min(1, 'Note content is required')
    .nonempty('Note content cannot be empty'),
  attachments: z.array(
    z
      .file()
      .refine((file) => file.size <= 10 * 1024 * 1024, {
        message: 'Each file must be less than 10MB',
      })
      .refine(
        (file) =>
          [
            'image/png',
            'image/jpeg',
            'application/pdf',
            'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
            'text/plain',
          ].includes(file.type),
        {
          message: 'Only PNG, JPEG, PDF, DOCX, and TXT files are allowed',
        },
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
