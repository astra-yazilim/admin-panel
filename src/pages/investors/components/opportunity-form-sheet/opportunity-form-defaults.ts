import type { OpportunityFormValues } from '@/schemas/opportunity.schema'
import type { InvestmentOpportunity, ProjectSubmission } from '@/types'
import { NO_LINK_VALUE } from '@/utils/validations/constants'

const STAGE_BY_SUBMISSION: Record<ProjectSubmission['stage'], OpportunityFormValues['stage']> = {
  idea: 'idea',
  designed: 'idea',
  in_development: 'mvp',
  stalled: 'mvp',
  live: 'early_revenue',
}

const EMPTY_DEFAULTS: Partial<OpportunityFormValues> = {
  title: '',
  tagline: '',
  projectId: NO_LINK_VALUE,
  submissionId: NO_LINK_VALUE,
  summary: '',
  problem: '',
  solution: '',
  targetMarket: '',
  businessModel: '',
  traction: '',
  useOfFunds: '',
  committedAmount: 0,
  estimatedTimeline: '',
  highlights: '',
  internalNote: '',
  status: 'draft',
}

export function getOpportunityFormDefaults(
  opportunity?: InvestmentOpportunity,
  submission?: ProjectSubmission,
): Partial<OpportunityFormValues> {
  if (opportunity) {
    return {
      ...opportunity,
      projectId: opportunity.projectId ?? NO_LINK_VALUE,
      submissionId: opportunity.submissionId ?? NO_LINK_VALUE,
      highlights: opportunity.highlights.join('\n'),
    }
  }
  if (submission) {
    return {
      ...EMPTY_DEFAULTS,
      title: submission.projectName,
      tagline: submission.summary,
      sector: submission.sector,
      source: 'project_submission',
      submissionId: submission.id,
      stage: STAGE_BY_SUBMISSION[submission.stage],
      summary: submission.summary,
      problem: submission.problem,
      targetMarket: submission.targetAudience,
      highlights: submission.coreFeatures,
    }
  }
  return EMPTY_DEFAULTS
}
