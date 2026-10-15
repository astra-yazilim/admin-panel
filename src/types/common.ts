export type Priority = 'low' | 'medium' | 'high' | 'critical'

export type SeniorityLevel = 'junior' | 'mid' | 'senior'

export type BadgeTone = 'neutral' | 'primary' | 'gold' | 'info' | 'warning' | 'danger' | 'success'

export interface Option<T extends string = string> {
  value: T
  label: string
}

export interface StatusConfig {
  label: string
  tone: BadgeTone
}

export interface Entity {
  id: string
}

export type Sector =
  | 'ecommerce'
  | 'retail'
  | 'fintech'
  | 'saas'
  | 'health'
  | 'education'
  | 'logistics'
  | 'tourism'
  | 'manufacturing'
  | 'agriculture'
  | 'media'
  | 'real_estate'
  | 'energy'
  | 'other'

export interface AgreementSignature {
  version: string
  signerName: string
  signedAt: string
}
