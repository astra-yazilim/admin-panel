import { DEMO_PASSWORD } from '@/mock/users.mock'
import type { AccessMethod, Credentials, Session } from '@/types'
import { ACCESS_VALIDITY_HOURS, ONE_TIME_PASSWORD_LENGTH, ROUTE_PATHS } from '@/utils/validations/constants'
import { messages } from '@/utils/validations/messages'
import { HttpError } from './http'
import { userService } from './user.service'

const PASSWORD_ALPHABET = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'
const HOUR_MS = 3_600_000

const oneTimePasswords = new Map<string, { code: string; expiresAt: number }>()

const normalizeEmail = (email: string) => email.trim().toLocaleLowerCase('en-US')

const generateCode = () =>
  Array.from(crypto.getRandomValues(new Uint32Array(ONE_TIME_PASSWORD_LENGTH)))
    .map((value) => PASSWORD_ALPHABET[value % PASSWORD_ALPHABET.length])
    .join('')

const consumeOneTimePassword = (email: string, code: string) => {
  const entry = oneTimePasswords.get(normalizeEmail(email))
  if (!entry || entry.code !== code.trim().toUpperCase() || entry.expiresAt < Date.now()) return false
  oneTimePasswords.delete(normalizeEmail(email))
  return true
}

export interface IssuedAccess {
  method: AccessMethod
  secret: string
  issuedAt: string
  expiresAt: string
}

export const authService = {
  async login({ email, password }: Credentials): Promise<Session> {
    const user = await userService.findByEmail(email)
    const isValid = password === DEMO_PASSWORD || consumeOneTimePassword(email, password)
    if (!user || !isValid) {
      throw new HttpError(messages.errors.invalidCredentials, 401)
    }
    return { user, accessToken: crypto.randomUUID() }
  },

  async requestPasswordReset(email: string) {
    await userService.findByEmail(email)
  },

  issueAccess(email: string, method: AccessMethod): IssuedAccess {
    const issuedAt = Date.now()
    const expiresAt = issuedAt + ACCESS_VALIDITY_HOURS * HOUR_MS
    const code = generateCode()
    oneTimePasswords.set(normalizeEmail(email), { code, expiresAt })
    const secret =
      method === 'one_time_password'
        ? code
        : `${window.location.origin}${ROUTE_PATHS.forgotPassword}?token=${crypto.randomUUID()}`
    return { method, secret, issuedAt: new Date(issuedAt).toISOString(), expiresAt: new Date(expiresAt).toISOString() }
  },
}
