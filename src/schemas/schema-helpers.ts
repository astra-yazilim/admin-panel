import { z } from 'zod'
import { messages } from '@/utils/validations/messages'

export const PHONE_PATTERN = /^0?5\d{2}\s?\d{3}\s?\d{2}\s?\d{2}$|^0?\d{3}\s?\d{3}\s?\d{2}\s?\d{2}$/

export const keysOf = <T extends string>(record: Record<T, unknown>) => Object.keys(record) as [T, ...T[]]

export const requiredEnum = <T extends string>(record: Record<T, unknown>) =>
  z.enum(keysOf(record), { message: messages.validation.required })

export const requiredText = (minLength = 1) =>
  z
    .string()
    .trim()
    .min(minLength, minLength > 1 ? messages.validation.minLength(minLength) : messages.validation.required)

export const getEmailDomain = (email: string) => email.split('@')[1]?.toLocaleLowerCase('en-US') ?? ''
