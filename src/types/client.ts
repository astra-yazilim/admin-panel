export type ClientStatus = 'active' | 'inactive'

export type SurveyStatus = 'sent' | 'completed'

export interface Client {
  id: string
  companyName: string
  contactName: string
  email: string
  phone: string
  website: string
  sector: string
  city: string
  status: ClientStatus
  createdAt: string
}

export interface Survey {
  id: string
  clientId: string
  projectId: string
  developerIds: string[]
  status: SurveyStatus
  sentAt: string
  completedAt?: string
  overallRating?: number
  communicationScore?: number
  technicalScore?: number
  comment?: string
}
