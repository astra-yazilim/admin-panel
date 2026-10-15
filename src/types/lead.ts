export type LeadStatus = 'new' | 'reviewing' | 'proposal_sent' | 'accepted' | 'rejected'

export type ServiceType =
  | 'ecommerce_setup'
  | 'marketplace_integration'
  | 'custom_web'
  | 'mobile_app'
  | 'ui_ux'
  | 'bug_fix'
  | 'core_product'

export interface Lead {
  id: string
  fullName: string
  email: string
  phone: string
  companyName: string
  website: string
  service: ServiceType
  message: string
  kvkkConsent: boolean
  status: LeadStatus
  internalNote: string
  convertedProjectId?: string
  createdAt: string
}
