import { Lock, Sparkles } from 'lucide-react'
import { useState } from 'react'
import { EmptyState } from '@/components/common/empty-state/empty-state'
import { PageHeader } from '@/components/common/page-header/page-header'
import { PageLoader } from '@/components/common/page-loader/page-loader'
import { useAuth } from '@/hooks/use-auth'
import { useEntityMap } from '@/hooks/use-entity-map'
import { useMyInterests, usePublishedOpportunities } from '@/hooks/use-opportunities'
import type { OpportunitySummary } from '@/types'
import { messages } from '@/utils/validations/messages'
import { InterestDialog } from './components/interest-dialog/interest-dialog'
import { MyInterests } from './components/my-interests/my-interests'
import { OpportunityCard } from './components/opportunity-card/opportunity-card'
import { OpportunityDetailSheet } from './components/opportunity-detail-sheet/opportunity-detail-sheet'
import styles from './opportunities-page.module.css'

export default function OpportunitiesPage() {
  const { user } = useAuth()
  const { data: opportunities = [], isLoading } = usePublishedOpportunities()
  const { data: interests = [] } = useMyInterests()
  const opportunityMap = useEntityMap(opportunities)
  const [selectedId, setSelectedId] = useState<string>()
  const [interestTarget, setInterestTarget] = useState<OpportunitySummary>()

  const hasInterest = (opportunityId: string) => interests.some((interest) => interest.opportunityId === opportunityId)

  const openInterest = (opportunity: OpportunitySummary) => {
    setSelectedId(undefined)
    setInterestTarget(opportunity)
  }

  return (
    <>
      <PageHeader title={messages.opportunities.title} description={messages.opportunities.description} />
      <p className={styles.banner}>
        <Lock />
        {messages.opportunities.confidentialBanner(user?.fullName ?? '')}
      </p>
      {isLoading ? (
        <PageLoader />
      ) : opportunities.length === 0 ? (
        <EmptyState icon={Sparkles} title={messages.opportunities.empty} />
      ) : (
        <div className={styles.grid}>
          {opportunities.map((opportunity) => (
            <OpportunityCard
              key={opportunity.id}
              opportunity={opportunity}
              hasInterest={hasInterest(opportunity.id)}
              onSelect={() => setSelectedId(opportunity.id)}
            />
          ))}
        </div>
      )}
      {user?.investorId && <MyInterests interests={interests} opportunities={opportunityMap} />}
      <OpportunityDetailSheet
        opportunity={opportunityMap.get(selectedId ?? '')}
        hasInterest={hasInterest(selectedId ?? '')}
        onOpenChange={(open) => !open && setSelectedId(undefined)}
        onInterest={openInterest}
      />
      <InterestDialog opportunity={interestTarget} onOpenChange={(open) => !open && setInterestTarget(undefined)} />
    </>
  )
}
