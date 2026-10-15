import { toast } from 'sonner'
import { messages } from '@/utils/validations/messages'
import { logger } from './logger'

const getErrorMessage = (error: unknown) => (error instanceof Error ? error.message : messages.errors.unexpected)

export const showToast = {
  success: (message: string, description?: string) => toast.success(message, { description }),
  info: (message: string, description?: string) => toast.info(message, { description }),
  error: (error: unknown, fallback?: string) => {
    logger.error(fallback ?? getErrorMessage(error), error)
    toast.error(fallback ?? getErrorMessage(error))
  },
}
