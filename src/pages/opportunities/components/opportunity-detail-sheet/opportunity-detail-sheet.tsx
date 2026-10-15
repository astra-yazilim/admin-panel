import { CheckCircle2, HandCoins, Lock } from 'lucide-react'
import { DetailList } from '@/components/common/detail-list/detail-list'
import { FundingProgress } from '@/components/common/funding-progress/funding-progress'
import { StatusBadge } from '@/components/common/status-badge/status-badge'
import { Button } from '@/components/ui/button'
import { Sheet, SheetContent, SheetDescription, SheetFooter, SheetHeader, SheetTitle } from '@/components/ui/sheet'
import { useAuth } from '@/hooks/use-auth'
import type { OpportunitySummary } from '@/types'
import {
  INVESTMENT_MODEL_LABELS,
  INVESTMENT_STAGE_LABELS,
  SECTOR_LABELS,
} from '@/utils/validations/constants'
import { formatCurrency } from '@/utils/validations/formatters'
import { messages } from '@/utils/validations/messages'
import { ConfidentialWatermark } from '../confidential-watermark/confidential-watermark'
import styles from './opportunity-detail-sheet.module.css'

const { opportunities: copy } = messages

type NarrativeKey = 'summary' | 'problem' | 'solution' | 'targetMarket' | 'businessModel' | 'traction' | 'useOfFunds'
const NARRATIVE_SECTIONS: NarrativeKey[] = ['summary', 'problem', 'solution', 'targetMarket', 'businessModel', 'traction', 'useOfFunds']

interface OpportunityDetailSheetProps {
  opportunity: OpportunitySummary | undefined
  hasInterest: boolean
  onOpenChange: (open: boolean) => void
  onInterest: (opportunity: OpportunitySummary) => void
}

export function OpportunityDetailSheet({ opportunity, hasInterest, onOpenChange, onInterest }: OpportunityDetailSheetProps) {
  const { user } = useAuth()
  const canRequest = Boolean(user?.investorId)

  return (
    <Sheet open={Boolean(opportunity)} onOpenChange={onOpenChange}>
      <SheetContent className={styles.content}>
        {opportunity && user && (
          <>
            <SheetHeader className={styles.header}>
              <span className={styles.confidential}>
                <Lock />
                {copy.confidential}
              </span>
              <SheetTitle className={styles.title}>{opportunity.title}</SheetTitle>
              <SheetDescription>{opportunity.tagline}</SheetDescription>
            </SheetHeader>
            <ConfidentialWatermark text={copy.watermark(user.fullName, user.email)}>
              <div className={styles.body}>
                <div className={styles.tags}>
                  <StatusBadge label={SECTOR_LABELS[opportunity.sector]} tone="primary" />
                  <StatusBadge label={INVESTMENT_STAGE_LABELS[opportunity.stage]} />
                  <StatusBadge label={INVESTMENT_MODEL_LABELS[opportunity.investmentModel]} tone="gold" />
                </div>
                <FundingProgress committed={opportunity.committedAmount} target={opportunity.fundingTarget} />
                <DetailList
                  items={[
                    { label: copy.target, value: formatCurrency(opportunity.fundingTarget) },
                    { label: copy.minimumTicket, value: formatCurrency(opportunity.minimumTicket) },
                    { label: copy.model, value: INVESTMENT_MODEL_LABELS[opportunity.investmentModel] },
                    { label: copy.timeline, value: opportunity.estimatedTimeline || messages.common.notSpecified },
                  ]}
                />
                {NARRATIVE_SECTIONS.filter((key) => opportunity[key]).map((key) => (
                  <section key={key} className={styles.section}>
                    <h3 className={styles.heading}>{copy.sections[key]}</h3>
                    <p className={styles.text}>{opportunity[key]}</p>
                  </section>
                ))}
                {opportunity.highlights.length > 0 && (
                  <section className={styles.section}>
                    <h3 className={styles.heading}>{copy.sections.highlights}</h3>
                    <ul className={styles.highlights}>
                      {opportunity.highlights.map((highlight) => (
                        <li key={highlight}>
                          <CheckCircle2 />
                          {highlight}
                        </li>
                      ))}
                    </ul>
                  </section>
                )}
              </div>
            </ConfidentialWatermark>
            {canRequest && (
              <SheetFooter className={styles.footer}>
                {hasInterest ? (
                  <span className={styles.sent}>
                    <CheckCircle2 />
                    {copy.interest.sent}
                  </span>
                ) : (
                  <Button onClick={() => onInterest(opportunity)}>
                    <HandCoins />
                    {copy.interest.cta}
                  </Button>
                )}
              </SheetFooter>
            )}
          </>
        )}
      </SheetContent>
    </Sheet>
  )
}
