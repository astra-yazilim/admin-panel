import type { Role } from './role'

export interface User {
  id: string
  fullName: string
  email: string
  role: Role
  title: string
  avatarUrl?: string
  developerId?: string
  investorId?: string
  createdAt: string
}

export interface Credentials {
  email: string
  password: string
}

export interface Session {
  user: User
  accessToken: string
}
