import { StatusBadge } from '@/components/common/status-badge/status-badge'
import type { InvestmentInterest, OpportunitySummary } from '@/types'
import { INTEREST_STATUS_CONFIG, INVESTMENT_BUDGET_LABELS } from '@/utils/validations/constants'
import { formatDate } from '@/utils/validations/formatters'
import { messages } from '@/utils/validations/messages'
import styles from './my-interests.module.css'

interface MyInterestsProps {
  interests: InvestmentInterest[]
  opportunities: Map<string, OpportunitySummary>
}

export function MyInterests({ interests, opportunities }: MyInterestsProps) {
  return (
    <section className={styles.root}>
      <h2 className={styles.title}>{messages.opportunities.myInterests}</h2>
      {interests.length === 0 ? (
        <p className={styles.empty}>{messages.opportunities.noInterests}</p>
      ) : (
        <ul className={styles.list}>
          {interests.map((interest) => {
            const opportunity = opportunities.get(interest.opportunityId)
            return (
              <li key={interest.id} className={styles.item}>
                <div className={styles.main}>
                  <span className={styles.code}>{opportunity?.code}</span>
                  <span className={styles.name}>{opportunity?.title}</span>
                  <span className={styles.meta}>
                    {INVESTMENT_BUDGET_LABELS[interest.amountRange]} · {formatDate(interest.createdAt)}
                  </span>
                </div>
                <StatusBadge config={INTEREST_STATUS_CONFIG[interest.status]} />
              </li>
            )
          })}
        </ul>
      )}
    </section>
  )
}
