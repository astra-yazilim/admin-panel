import { HandCoins } from 'lucide-react'
import { EmptyState } from '@/components/common/empty-state/empty-state'
import { SelectField } from '@/components/common/select-field/select-field'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { useEntityMap } from '@/hooks/use-entity-map'
import { useInvestors } from '@/hooks/use-investors'
import { useInterests, useOpportunities, useUpdateInterestStatus } from '@/hooks/use-opportunities'
import type { InterestStatus } from '@/types'
import { INTEREST_STATUS_CONFIG, INVESTMENT_BUDGET_LABELS } from '@/utils/validations/constants'
import { formatRelativeDate } from '@/utils/validations/formatters'
import { toStatusOptions } from '@/utils/validations/helpers'
import { messages } from '@/utils/validations/messages'
import styles from './interest-table.module.css'

const STATUS_OPTIONS = toStatusOptions(INTEREST_STATUS_CONFIG)
const { interests: copy } = messages.investors

export function InterestTable() {
  const { data: interests = [] } = useInterests()
  const { data: investors } = useInvestors()
  const { data: opportunities } = useOpportunities()
  const updateStatus = useUpdateInterestStatus()
  const investorMap = useEntityMap(investors)
  const opportunityMap = useEntityMap(opportunities)

  if (interests.length === 0) return <EmptyState icon={HandCoins} title={copy.empty} />

  return (
    <div className={styles.root}>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>{copy.columns.investor}</TableHead>
            <TableHead>{copy.columns.opportunity}</TableHead>
            <TableHead>{copy.columns.amount}</TableHead>
            <TableHead>{copy.columns.note}</TableHead>
            <TableHead>{copy.columns.status}</TableHead>
            <TableHead className={styles.date}>{copy.columns.createdAt}</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {[...interests]
            .sort((a, b) => b.createdAt.localeCompare(a.createdAt))
            .map((interest) => {
              const investor = investorMap.get(interest.investorId)
              const opportunity = opportunityMap.get(interest.opportunityId)
              return (
                <TableRow key={interest.id}>
                  <TableCell>
                    <span className={styles.stack}>
                      <span className={styles.name}>{investor?.fullName}</span>
                      <span className={styles.muted}>{investor?.companyName}</span>
                    </span>
                  </TableCell>
                  <TableCell>
                    <span className={styles.stack}>
                      <span className={styles.code}>{opportunity?.code}</span>
                      <span>{opportunity?.title}</span>
                    </span>
                  </TableCell>
                  <TableCell>{INVESTMENT_BUDGET_LABELS[interest.amountRange]}</TableCell>
                  <TableCell className={styles.note}>{interest.note || '—'}</TableCell>
                  <TableCell className={styles.status}>
                    <SelectField<InterestStatus>
                      value={interest.status}
                      onValueChange={(status) => updateStatus.mutate({ id: interest.id, status })}
                      options={STATUS_OPTIONS}
                      aria-label={copy.columns.status}
                    />
                  </TableCell>
                  <TableCell className={styles.date}>{formatRelativeDate(interest.createdAt)}</TableCell>
                </TableRow>
              )
            })}
        </TableBody>
      </Table>
    </div>
  )
}
