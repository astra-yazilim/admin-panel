import type { Sector } from './common'
import type { InvestmentBudgetRange, InvestmentStage } from './investor'

export type OpportunityStatus = 'draft' | 'open' | 'closed'

export type OpportunitySource = 'internal_product' | 'client_project' | 'project_submission'

export type InvestmentModel = 'equity' | 'revenue_share' | 'convertible'

export type InterestStatus = 'new' | 'in_discussion' | 'committed' | 'declined'

export interface InvestmentOpportunity {
  id: string
  code: string
  title: string
  tagline: string
  sector: Sector
  source: OpportunitySource
  projectId?: string
  submissionId?: string
  stage: InvestmentStage
  summary: string
  problem: string
  solution: string
  targetMarket: string
  businessModel: string
  traction: string
  useOfFunds: string
  fundingTarget: number
  minimumTicket: number
  committedAmount: number
  investmentModel: InvestmentModel
  estimatedTimeline: string
  highlights: string[]
  internalNote: string
  status: OpportunityStatus
  createdAt: string
}

export type OpportunitySummary = Omit<InvestmentOpportunity, 'source' | 'projectId' | 'submissionId' | 'internalNote'>

export interface InvestmentInterest {
  id: string
  opportunityId: string
  investorId: string
  amountRange: InvestmentBudgetRange
  note: string
  status: InterestStatus
  createdAt: string
}
