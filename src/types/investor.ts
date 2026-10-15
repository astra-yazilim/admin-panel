import type { AgreementSignature, Sector } from './common'

export type InvestorStatus = 'received' | 'reviewing' | 'meeting' | 'approved' | 'rejected'

export type InvestorType = 'individual' | 'corporate' | 'angel_network' | 'family_office' | 'fund'

export type EmployeeCountRange = '1_10' | '11_50' | '51_200' | '201_1000' | '1000_plus'

export type InvestmentBudgetRange = '250k_1m' | '1m_5m' | '5m_20m' | '20m_plus'

export type InvestmentHorizon = 'under_1y' | '1_3y' | '3_5y' | '5y_plus'

export type InvestmentStage = 'idea' | 'mvp' | 'early_revenue' | 'growth'

export type InvestorInvolvement = 'passive' | 'mentor' | 'active'

export type PreviousInvestments = 'none' | '1_3' | '4_10' | '10_plus'

export type AccessMethod = 'one_time_password' | 'password_setup_link'

export interface InvestorAccess {
  method: AccessMethod
  issuedAt: string
  expiresAt: string
}

export interface Investor {
  id: string
  fullName: string
  corporateEmail: string
  phone: string
  city: string
  title: string
  profession: string
  linkedinUrl: string
  companyName: string
  companyWebsite: string
  sector: Sector
  employeeCount: EmployeeCountRange
  investorType: InvestorType
  budgetRange: InvestmentBudgetRange
  horizon: InvestmentHorizon
  preferredStages: InvestmentStage[]
  interestAreas: Sector[]
  previousInvestments: PreviousInvestments
  involvement: InvestorInvolvement
  hasInvestorLicense: boolean
  referralSource: string
  note: string
  kvkkConsent: boolean
  agreement: AgreementSignature
  status: InvestorStatus
  reviewerNote: string
  meetingAt?: string
  userId?: string
  access?: InvestorAccess
  createdAt: string
}
