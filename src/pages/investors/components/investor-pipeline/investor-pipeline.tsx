import { Briefcase } from 'lucide-react'
import { useMemo, useState } from 'react'
import { EmptyState } from '@/components/common/empty-state/empty-state'
import { FilterTabs } from '@/components/common/filter-tabs/filter-tabs'
import { SearchInput } from '@/components/common/search-input/search-input'
import { StatusBadge } from '@/components/common/status-badge/status-badge'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { useInvestors } from '@/hooks/use-investors'
import type { InvestorStatus } from '@/types'
import {
  ALL_FILTER_VALUE,
  INVESTMENT_BUDGET_LABELS,
  INVESTOR_STATUS_CONFIG,
  INVESTOR_STATUS_ORDER,
  INVESTOR_TYPE_LABELS,
} from '@/utils/validations/constants'
import { formatRelativeDate } from '@/utils/validations/formatters'
import { buildFilterTabs, countBy, matchesSearch } from '@/utils/validations/helpers'
import { messages } from '@/utils/validations/messages'
import { InvestorDetailSheet } from '../investor-detail-sheet/investor-detail-sheet'
import styles from './investor-pipeline.module.css'

type StatusFilter = InvestorStatus | typeof ALL_FILTER_VALUE
const { columns } = messages.investors

export function InvestorPipeline() {
  const { data: investors = [] } = useInvestors()
  const [status, setStatus] = useState<StatusFilter>(ALL_FILTER_VALUE)
  const [search, setSearch] = useState('')
  const [selectedId, setSelectedId] = useState<string>()

  const tabs = useMemo(
    () =>
      buildFilterTabs(messages.common.all, INVESTOR_STATUS_ORDER, INVESTOR_STATUS_CONFIG, countBy(investors, (item) => item.status)),
    [investors],
  )

  const filtered = investors
    .filter((investor) => status === ALL_FILTER_VALUE || investor.status === status)
    .filter((investor) => matchesSearch(search, investor.fullName, investor.companyName, investor.corporateEmail))
    .sort((a, b) => b.createdAt.localeCompare(a.createdAt))

  return (
    <div className={styles.root}>
      <div className={styles.toolbar}>
        <FilterTabs<StatusFilter> tabs={tabs} value={status} onChange={setStatus} />
        <SearchInput value={search} onChange={setSearch} placeholder={messages.investors.searchPlaceholder} />
      </div>
      {filtered.length === 0 ? (
        <EmptyState icon={Briefcase} title={messages.investors.empty} />
      ) : (
        <div className={styles.table}>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>{columns.investor}</TableHead>
                <TableHead>{columns.company}</TableHead>
                <TableHead>{columns.type}</TableHead>
                <TableHead>{columns.budget}</TableHead>
                <TableHead>{columns.status}</TableHead>
                <TableHead className={styles.date}>{columns.createdAt}</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map((investor) => (
                <TableRow key={investor.id} className={styles.row} onClick={() => setSelectedId(investor.id)}>
                  <TableCell>
                    <span className={styles.stack}>
                      <span className={styles.name}>{investor.fullName}</span>
                      <span className={styles.muted}>{investor.corporateEmail}</span>
                    </span>
                  </TableCell>
                  <TableCell>
                    <span className={styles.stack}>
                      <span>{investor.companyName}</span>
                      <span className={styles.muted}>{investor.title}</span>
                    </span>
                  </TableCell>
                  <TableCell>{INVESTOR_TYPE_LABELS[investor.investorType]}</TableCell>
                  <TableCell className={styles.budget}>{INVESTMENT_BUDGET_LABELS[investor.budgetRange]}</TableCell>
                  <TableCell>
                    <StatusBadge config={INVESTOR_STATUS_CONFIG[investor.status]} />
                  </TableCell>
                  <TableCell className={styles.date}>{formatRelativeDate(investor.createdAt)}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}
      <InvestorDetailSheet
        investor={investors.find((investor) => investor.id === selectedId)}
        onOpenChange={(open) => !open && setSelectedId(undefined)}
      />
    </div>
  )
}
