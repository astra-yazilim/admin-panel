import { MOCK_FINANCES } from '@/mock/financials.mock'
import type { PaymentStage, ProjectFinance } from '@/types'
import { DB_TABLES } from '@/utils/validations/constants'
import { createRepository } from './http'

const repository = createRepository<ProjectFinance>(DB_TABLES.finances, MOCK_FINANCES)

export const financeService = {
  list: () => repository.list(),

  async markPaymentPaid(id: string, stage: PaymentStage) {
    const finance = await repository.getById(id)
    const paidAt = new Date().toISOString()
    return repository.update(id, {
      payments: finance.payments.map((payment) =>
        payment.stage === stage ? { ...payment, status: 'paid', paidAt } : payment,
      ),
    })
  },
}
