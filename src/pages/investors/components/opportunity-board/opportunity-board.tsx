import { Pencil, Plus, Sparkles } from 'lucide-react'
import { useState } from 'react'
import { EmptyState } from '@/components/common/empty-state/empty-state'
import { FundingProgress } from '@/components/common/funding-progress/funding-progress'
import { StatusBadge } from '@/components/common/status-badge/status-badge'
import { Button } from '@/components/ui/button'
import { useInterests, useOpportunities } from '@/hooks/use-opportunities'
import type { InvestmentOpportunity } from '@/types'
import {
  INVESTMENT_MODEL_LABELS,
  INVESTMENT_STAGE_LABELS,
  OPPORTUNITY_SOURCE_LABELS,
  OPPORTUNITY_STATUS_CONFIG,
  SECTOR_LABELS,
} from '@/utils/validations/constants'
import { messages } from '@/utils/validations/messages'
import { OpportunityFormSheet } from '../opportunity-form-sheet/opportunity-form-sheet'
import styles from './opportunity-board.module.css'

interface FormState {
  isOpen: boolean
  opportunity?: InvestmentOpportunity
}

const { opportunities: copy } = messages.investors

export function OpportunityBoard() {
  const { data: opportunities = [] } = useOpportunities()
  const { data: interests = [] } = useInterests()
  const [formState, setFormState] = useState<FormState>({ isOpen: false })

  return (
    <div className={styles.root}>
      <div className={styles.toolbar}>
        <Button onClick={() => setFormState({ isOpen: true })}>
          <Plus />
          {copy.new}
        </Button>
      </div>
      {opportunities.length === 0 ? (
        <EmptyState icon={Sparkles} title={copy.empty} />
      ) : (
        <div className={styles.grid}>
          {opportunities.map((opportunity) => (
            <article key={opportunity.id} className={styles.card}>
              <div className={styles.header}>
                <span className={styles.code}>{opportunity.code}</span>
                <StatusBadge config={OPPORTUNITY_STATUS_CONFIG[opportunity.status]} />
                <Button
                  variant="ghost"
                  size="icon"
                  className={styles.edit}
                  aria-label={copy.edit}
                  onClick={() => setFormState({ isOpen: true, opportunity })}
                >
                  <Pencil />
                </Button>
              </div>
              <h3 className={styles.title}>{opportunity.title}</h3>
              <p className={styles.tagline}>{opportunity.tagline}</p>
              <div className={styles.tags}>
                <StatusBadge label={SECTOR_LABELS[opportunity.sector]} tone="primary" />
                <StatusBadge label={INVESTMENT_STAGE_LABELS[opportunity.stage]} />
                <StatusBadge label={INVESTMENT_MODEL_LABELS[opportunity.investmentModel]} tone="gold" />
              </div>
              <FundingProgress committed={opportunity.committedAmount} target={opportunity.fundingTarget} />
              <div className={styles.footer}>
                <span>{OPPORTUNITY_SOURCE_LABELS[opportunity.source]}</span>
                <span>{copy.interests(interests.filter((item) => item.opportunityId === opportunity.id).length)}</span>
              </div>
            </article>
          ))}
        </div>
      )}
      <OpportunityFormSheet
        open={formState.isOpen}
        opportunity={formState.opportunity}
        onOpenChange={(isOpen) => setFormState((state) => ({ ...state, isOpen }))}
      />
    </div>
  )
}
