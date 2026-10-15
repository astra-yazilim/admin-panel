import { MOCK_INVESTORS } from '@/mock/investors.mock'
import type { AccessMethod, Investor, InvestorStatus } from '@/types'
import { DB_TABLES } from '@/utils/validations/constants'
import { authService } from './auth.service'
import { createRepository } from './http'
import { userService } from './user.service'

const repository = createRepository<Investor>(DB_TABLES.investors, MOCK_INVESTORS)

export interface InvestorReview {
  status: InvestorStatus
  reviewerNote: string
  meetingAt?: string
}

export const investorService = {
  list: () => repository.list(),

  getById: (id: string) => repository.getById(id),

  updateReview: (id: string, review: InvestorReview) => repository.update(id, review),

  async approve(investor: Investor, method: AccessMethod, reviewerNote: string) {
    const userId =
      investor.userId ??
      (
        await userService.create({
          fullName: investor.fullName,
          email: investor.corporateEmail,
          role: 'investor',
          title: `${investor.title}, ${investor.companyName}`,
          investorId: investor.id,
          createdAt: new Date().toISOString(),
        })
      ).id
    const access = authService.issueAccess(investor.corporateEmail, method)
    const updated = await repository.update(investor.id, {
      status: 'approved',
      reviewerNote,
      userId,
      access: { method, issuedAt: access.issuedAt, expiresAt: access.expiresAt },
    })
    return { investor: updated, access }
  },
}
