import { CheckCircle2 } from 'lucide-react'
import { FundingProgress } from '@/components/common/funding-progress/funding-progress'
import { StatusBadge } from '@/components/common/status-badge/status-badge'
import type { OpportunitySummary } from '@/types'
import { INVESTMENT_MODEL_LABELS, INVESTMENT_STAGE_LABELS, SECTOR_LABELS } from '@/utils/validations/constants'
import { formatCompactCurrency } from '@/utils/validations/formatters'
import { messages } from '@/utils/validations/messages'
import styles from './opportunity-card.module.css'

interface OpportunityCardProps {
  opportunity: OpportunitySummary
  hasInterest: boolean
  onSelect: () => void
}

const { opportunities: copy } = messages

export function OpportunityCard({ opportunity, hasInterest, onSelect }: OpportunityCardProps) {
  return (
    <button type="button" className={styles.root} onClick={onSelect}>
      <div className={styles.header}>
        <span className={styles.code}>{opportunity.code}</span>
        {hasInterest && (
          <span className={styles.sent}>
            <CheckCircle2 />
            {copy.interest.sent}
          </span>
        )}
      </div>
      <h3 className={styles.title}>{opportunity.title}</h3>
      <p className={styles.tagline}>{opportunity.tagline}</p>
      <div className={styles.tags}>
        <StatusBadge label={SECTOR_LABELS[opportunity.sector]} tone="primary" />
        <StatusBadge label={INVESTMENT_STAGE_LABELS[opportunity.stage]} />
      </div>
      <FundingProgress committed={opportunity.committedAmount} target={opportunity.fundingTarget} />
      <dl className={styles.facts}>
        <div>
          <dt>{copy.minimumTicket}</dt>
          <dd>{formatCompactCurrency(opportunity.minimumTicket)}</dd>
        </div>
        <div>
          <dt>{copy.model}</dt>
          <dd>{INVESTMENT_MODEL_LABELS[opportunity.investmentModel]}</dd>
        </div>
      </dl>
    </button>
  )
}
