import { z } from 'zod'
import {
  INVESTMENT_BUDGET_LABELS,
  INVESTMENT_MODEL_LABELS,
  INVESTMENT_STAGE_LABELS,
  OPPORTUNITY_SOURCE_LABELS,
  OPPORTUNITY_STATUS_CONFIG,
  SECTOR_LABELS,
} from '@/utils/validations/constants'
import { messages } from '@/utils/validations/messages'
import { requiredEnum, requiredText } from './schema-helpers'

const positiveAmount = () => z.number({ message: messages.validation.positiveNumber }).positive(messages.validation.positiveNumber)

export const opportunitySchema = z.object({
  title: requiredText(5),
  tagline: requiredText(10),
  sector: requiredEnum(SECTOR_LABELS),
  source: requiredEnum(OPPORTUNITY_SOURCE_LABELS),
  projectId: z.string(),
  submissionId: z.string(),
  stage: requiredEnum(INVESTMENT_STAGE_LABELS),
  summary: requiredText(20),
  problem: requiredText(10),
  solution: requiredText(10),
  targetMarket: requiredText(),
  businessModel: requiredText(),
  traction: z.string().trim(),
  useOfFunds: z.string().trim(),
  fundingTarget: positiveAmount(),
  minimumTicket: positiveAmount(),
  committedAmount: z.number().min(0),
  investmentModel: requiredEnum(INVESTMENT_MODEL_LABELS),
  estimatedTimeline: z.string().trim(),
  highlights: z.string(),
  internalNote: z.string().trim(),
  status: requiredEnum(OPPORTUNITY_STATUS_CONFIG),
})

export const interestSchema = z.object({
  amountRange: requiredEnum(INVESTMENT_BUDGET_LABELS),
  note: z.string().trim(),
})

export type OpportunityFormValues = z.infer<typeof opportunitySchema>
export type InterestFormValues = z.infer<typeof interestSchema>
