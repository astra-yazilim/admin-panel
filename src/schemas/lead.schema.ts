import { z } from 'zod'
import type { ServiceType } from '@/types'
import { SERVICE_LABELS } from '@/utils/validations/constants'
import { messages } from '@/utils/validations/messages'
import { PHONE_PATTERN } from './schema-helpers'

const SERVICE_TYPES = Object.keys(SERVICE_LABELS) as [ServiceType, ...ServiceType[]]

export const leadSchema = z.object({
  fullName: z.string().trim().min(3, messages.validation.minLength(3)),
  email: z.string().trim().min(1, messages.validation.required).email(messages.validation.email),
  phone: z.string().trim().regex(PHONE_PATTERN, messages.validation.phone),
  companyName: z.string().trim(),
  website: z.string().trim(),
  service: z.enum(SERVICE_TYPES, { message: messages.validation.required }),
  message: z.string().trim().min(10, messages.validation.minLength(10)),
  kvkkConsent: z.boolean().refine(Boolean, messages.validation.consentRequired),
})

export type LeadFormValues = z.infer<typeof leadSchema>
