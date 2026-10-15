export type PaymentMethod = 'bank_transfer' | 'credit_card' | 'credit_purchase'

export type PaymentStage = 'advance' | 'milestone' | 'final'

export type PaymentStatus = 'paid' | 'pending' | 'overdue'

export type BillingType = 'fixed' | 'credit'

export interface PaymentTerms {
  advance: number
  milestone: number
  final: number
}

export interface Payment {
  stage: PaymentStage
  amount: number
  status: PaymentStatus
  dueDate: string
  paidAt?: string
}

export interface ProjectFinance {
  id: string
  projectId: string
  billingType: BillingType
  totalBudget: number
  creditUnits?: number
  paymentTerms: PaymentTerms
  paymentMethod: PaymentMethod
  payments: Payment[]
  developerPayout: number
}

export interface FinanceSummary {
  totalBudget: number
  collected: number
  outstanding: number
  developerPayout: number
  margin: number
  marginRate: number
}
