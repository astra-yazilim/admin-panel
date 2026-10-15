import type {
  Option,
  Payment,
  Permission,
  ProjectFinance,
  FinanceSummary,
  Role,
  Survey,
  DeveloperPerformance,
} from '@/types'
import { ALL_FILTER_VALUE, MAX_RATING, ROLE_PERMISSIONS, SURVEY_SCORE_WEIGHTS } from './constants'

const DAY_MS = 86_400_000

export const hasPermission = (role: Role | undefined, permission: Permission) =>
  role ? ROLE_PERMISSIONS[role].includes(permission) : false

export const toOptions = <T extends string>(labels: Record<T, string>): Option<T>[] =>
  (Object.entries(labels) as [T, string][]).map(([value, label]) => ({ value, label }))

export const toStatusOptions = <T extends string>(config: Record<T, { label: string }>): Option<T>[] =>
  (Object.entries(config) as [T, { label: string }][]).map(([value, { label }]) => ({ value, label }))

export const average = (values: number[]) =>
  values.length ? values.reduce((sum, value) => sum + value, 0) / values.length : 0

export const sumBy = <T>(items: T[], selector: (item: T) => number) =>
  items.reduce((sum, item) => sum + selector(item), 0)

export const countBy = <T, K extends string>(items: T[], selector: (item: T) => K) =>
  items.reduce(
    (counts, item) => {
      const key = selector(item)
      counts[key] = (counts[key] ?? 0) + 1
      return counts
    },
    {} as Partial<Record<K, number>>,
  )

export const daysUntil = (iso: string, now = new Date()) =>
  Math.ceil((new Date(iso).getTime() - now.getTime()) / DAY_MS)

export const matchesSearch = (query: string, ...fields: (string | undefined)[]) => {
  const normalized = query.trim().toLocaleLowerCase('tr-TR')
  if (!normalized) return true
  return fields.some((field) => field?.toLocaleLowerCase('tr-TR').includes(normalized))
}

export const getSurveyScore = (survey: Survey) =>
  (survey.overallRating ?? 0) * SURVEY_SCORE_WEIGHTS.overall +
  (survey.communicationScore ?? 0) * SURVEY_SCORE_WEIGHTS.communication +
  (survey.technicalScore ?? 0) * SURVEY_SCORE_WEIGHTS.technical

export const getDeveloperPerformance = (developerId: string, surveys: Survey[]): DeveloperPerformance => {
  const reviews = surveys.filter(
    (survey) => survey.status === 'completed' && survey.developerIds.includes(developerId),
  )
  return {
    reviewCount: reviews.length,
    averageRating: average(reviews.map((survey) => survey.overallRating ?? 0)),
    performanceIndex: Math.round((average(reviews.map(getSurveyScore)) / MAX_RATING) * 100),
  }
}

export const isPaid = (payment: Payment) => payment.status === 'paid'

export const getFinanceSummary = (finances: ProjectFinance[]): FinanceSummary => {
  const totalBudget = sumBy(finances, (finance) => finance.totalBudget)
  const collected = sumBy(finances, (finance) => sumBy(finance.payments.filter(isPaid), (payment) => payment.amount))
  const developerPayout = sumBy(finances, (finance) => finance.developerPayout)
  const margin = totalBudget - developerPayout
  return {
    totalBudget,
    collected,
    outstanding: totalBudget - collected,
    developerPayout,
    margin,
    marginRate: totalBudget ? margin / totalBudget : 0,
  }
}

export const buildFilterTabs = <T extends string>(
  allLabel: string,
  order: T[],
  config: Record<T, { label: string }>,
  counts: Partial<Record<T, number>>,
) => [
  { value: ALL_FILTER_VALUE, label: allLabel, count: order.reduce((sum, key) => sum + (counts[key] ?? 0), 0) },
  ...order.map((value) => ({ value, label: config[value].label, count: counts[value] ?? 0 })),
]
