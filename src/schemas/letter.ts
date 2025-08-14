import * as z from 'zod'

export const letterFormData = z.object({
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

export type LetterFormData = z.infer<typeof letterFormData>