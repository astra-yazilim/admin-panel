import { MOCK_INTERESTS, MOCK_OPPORTUNITIES } from '@/mock/investors.mock'
import type { InterestFormValues, OpportunityFormValues } from '@/schemas/opportunity.schema'
import type { InterestStatus, InvestmentInterest, InvestmentOpportunity, OpportunitySummary } from '@/types'
import { DB_TABLES, NO_LINK_VALUE } from '@/utils/validations/constants'
import { createRepository } from './http'
import { projectSubmissionService } from './project-submission.service'

const opportunityRepository = createRepository<InvestmentOpportunity>(DB_TABLES.opportunities, MOCK_OPPORTUNITIES)
const interestRepository = createRepository<InvestmentInterest>(DB_TABLES.interests, MOCK_INTERESTS)

const CODE_PREFIX = 'INV-'

const nextCode = (opportunities: InvestmentOpportunity[]) => {
  const numbers = opportunities.map((opportunity) => Number(opportunity.code.replace(CODE_PREFIX, '')) || 0)
  return `${CODE_PREFIX}${String(Math.max(0, ...numbers) + 1).padStart(3, '0')}`
}

const toSummary = ({
  source: _source,
  projectId: _projectId,
  submissionId: _submissionId,
  internalNote: _internalNote,
  ...summary
}: InvestmentOpportunity): OpportunitySummary => summary

const fromFormValues = (values: OpportunityFormValues) => ({
  ...values,
  projectId: values.source !== 'project_submission' && values.projectId !== NO_LINK_VALUE ? values.projectId : undefined,
  submissionId:
    values.source === 'project_submission' && values.submissionId !== NO_LINK_VALUE ? values.submissionId : undefined,
  highlights: values.highlights
    .split('\n')
    .map((line) => line.trim())
    .filter(Boolean),
})

export const opportunityService = {
  list: () => opportunityRepository.list(),

  async listPublished(): Promise<OpportunitySummary[]> {
    const opportunities = await opportunityRepository.list()
    return opportunities.filter((opportunity) => opportunity.status === 'open').map(toSummary)
  },

  async create(values: OpportunityFormValues) {
    const opportunities = await opportunityRepository.list()
    const opportunity = await opportunityRepository.create({
      ...fromFormValues(values),
      code: nextCode(opportunities),
      createdAt: new Date().toISOString(),
    })
    if (opportunity.submissionId) await projectSubmissionService.linkOpportunity(opportunity.submissionId, opportunity.id)
    return opportunity
  },

  update: (id: string, values: OpportunityFormValues) => opportunityRepository.update(id, fromFormValues(values)),

  listInterests: () => interestRepository.list(),

  async listInterestsByInvestor(investorId: string) {
    const interests = await interestRepository.list()
    return interests.filter((interest) => interest.investorId === investorId)
  },

  createInterest: (investorId: string, opportunityId: string, values: InterestFormValues) =>
    interestRepository.create({
      ...values,
      investorId,
      opportunityId,
      status: 'new',
      createdAt: new Date().toISOString(),
    }),

  updateInterestStatus: (id: string, status: InterestStatus) => interestRepository.update(id, { status }),
}
