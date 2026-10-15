import { z } from 'zod'
import { messages } from '@/utils/validations/messages'

const PASSWORD_MIN_LENGTH = 6

export const loginSchema = z.object({
  email: z.string().min(1, messages.validation.required).email(messages.validation.email),
  password: z.string().min(PASSWORD_MIN_LENGTH, messages.validation.minLength(PASSWORD_MIN_LENGTH)),
})

export const forgotPasswordSchema = loginSchema.pick({ email: true })

export type LoginFormValues = z.infer<typeof loginSchema>
export type ForgotPasswordFormValues = z.infer<typeof forgotPasswordSchema>
