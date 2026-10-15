import type { AgreementSignature, Sector } from './common'

export type SubmissionStatus = 'received' | 'technical_review' | 'meeting' | 'approved' | 'rejected'

export type ProductType = 'web' | 'mobile' | 'ecommerce' | 'saas' | 'internal_tool' | 'ai' | 'other'

export type SubmissionStage = 'idea' | 'designed' | 'in_development' | 'stalled' | 'live'

export type Platform = 'web' | 'ios' | 'android' | 'admin_panel' | 'desktop'

export type ExistingAsset =
  | 'requirements'
  | 'design'
  | 'source_code'
  | 'live_environment'
  | 'test_environment'
  | 'documentation'

export type IntegrationNeed = 'payment' | 'erp' | 'marketplace' | 'cargo' | 'sms_email' | 'maps' | 'ai' | 'sso'

export type ExpectedUsers = 'under_1k' | '1k_10k' | '10k_100k' | '100k_plus'

export type ProjectBudgetRange = 'under_100k' | '100k_250k' | '250k_500k' | '500k_1m' | '1m_plus' | 'undecided'

export type DeliveryTimeline = 'asap' | '1_3_months' | '3_6_months' | '6_plus_months' | 'flexible'

export type FundingStatus = 'self_funded' | 'seeking' | 'funded' | 'grant'

export type CollaborationModel = 'continue_existing' | 'build_from_scratch' | 'referral' | 'partnership'

export interface ReferralInfo {
  companyName: string
  contactName: string
  contactEmail: string
  relationship: string
}

export interface ProjectSubmission {
  id: string
  code: string
  fullName: string
  email: string
  phone: string
  companyName: string
  role: string
  linkedinUrl: string
  projectName: string
  productType: ProductType
  sector: Sector
  summary: string
  problem: string
  targetAudience: string
  stage: SubmissionStage
  existingAssets: ExistingAsset[]
  completionPercent: number
  techStack: string
  repositoryUrl: string
  stallReason: string
  platforms: Platform[]
  coreFeatures: string
  integrations: IntegrationNeed[]
  expectedUsers: ExpectedUsers
  technicalRequirements: string
  budgetRange: ProjectBudgetRange
  timeline: DeliveryTimeline
  fundingStatus: FundingStatus
  collaborationModel: CollaborationModel
  referral?: ReferralInfo
  kvkkConsent: boolean
  ndaRequested: boolean
  agreement: AgreementSignature
  status: SubmissionStatus
  reviewerNote: string
  convertedProjectId?: string
  opportunityId?: string
  createdAt: string
}
