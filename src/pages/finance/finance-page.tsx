import { AlertTriangle, ArrowUpRight, Banknote, HandCoins, PiggyBank, Wallet } from 'lucide-react'
import { useState } from 'react'
import { Link } from 'react-router-dom'
import { EmptyState } from '@/components/common/empty-state/empty-state'
import { PageHeader } from '@/components/common/page-header/page-header'
import { PageLoader } from '@/components/common/page-loader/page-loader'
import { StatCard } from '@/components/common/stat-card/stat-card'
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from '@/components/ui/sheet'
import { useAuth } from '@/hooks/use-auth'
import { useClients } from '@/hooks/use-clients'
import { useEntityMap } from '@/hooks/use-entity-map'
import { useFinances } from '@/hooks/use-finance'
import { useProjects } from '@/hooks/use-projects'
import { PERMISSIONS, type ProjectFinance } from '@/types'
import { PROJECT_BOARD_PARAMS, ROUTE_PATHS } from '@/utils/validations/constants'
import { formatCompactCurrency, formatPercent, withQuery } from '@/utils/validations/formatters'
import { getFinanceSummary } from '@/utils/validations/helpers'
import { messages } from '@/utils/validations/messages'
import { FinanceOverview } from './components/finance-overview/finance-overview'
import { FinanceTable } from './components/finance-table/finance-table'
import styles from './finance-page.module.css'

const { kpi } = messages.finance

export default function FinancePage() {
  const { can } = useAuth()
  const { data: finances = [], isLoading } = useFinances()
  const { data: projects } = useProjects()
  const { data: clients } = useClients()
  const projectMap = useEntityMap(projects)
  const clientMap = useEntityMap(clients)
  const [selected, setSelected] = useState<ProjectFinance>()
  const showPayouts = can(PERMISSIONS.FINANCE_PAYOUTS_VIEW)

  const summary = getFinanceSummary(finances)
  const overdueCount = finances.flatMap((finance) => finance.payments).filter((p) => p.status === 'overdue').length
  const selectedFinance = finances.find((finance) => finance.id === selected?.id)
  const selectedProject = projectMap.get(selectedFinance?.projectId ?? '')

  if (isLoading) return <PageLoader />

  return (
    <>
      <PageHeader title={messages.finance.title} description={messages.finance.description} />
      <section className={styles.kpis}>
        <StatCard icon={Wallet} label={kpi.totalBudget} value={formatCompactCurrency(summary.totalBudget)} />
        <StatCard
          icon={Banknote}
          label={kpi.collected}
          value={formatCompactCurrency(summary.collected)}
          hint={kpi.collectionRate(formatPercent(summary.totalBudget ? summary.collected / summary.totalBudget : 0))}
        />
        <StatCard
          icon={AlertTriangle}
          tone="danger"
          label={kpi.outstanding}
          value={formatCompactCurrency(summary.outstanding)}
          hint={kpi.overdue(overdueCount)}
        />
        {showPayouts && (
          <StatCard icon={HandCoins} tone="gold" label={kpi.payout} value={formatCompactCurrency(summary.developerPayout)} />
        )}
        {showPayouts && (
          <StatCard
            icon={PiggyBank}
            tone="info"
            label={kpi.margin}
            value={formatCompactCurrency(summary.margin)}
            hint={kpi.marginRate(formatPercent(summary.marginRate))}
          />
        )}
      </section>

      {finances.length === 0 ? (
        <EmptyState icon={Wallet} title={messages.finance.empty} />
      ) : (
        <FinanceTable
          finances={finances}
          projects={projectMap}
          clients={clientMap}
          showPayouts={showPayouts}
          onSelect={setSelected}
        />
      )}

      <Sheet open={Boolean(selectedFinance)} onOpenChange={(open) => !open && setSelected(undefined)}>
        <SheetContent className={styles.sheet}>
          <SheetHeader className={styles.sheetHeader}>
            <SheetTitle>{selectedProject?.title}</SheetTitle>
            <SheetDescription>
              {selectedProject && (
                <Link
                  to={withQuery(ROUTE_PATHS.projects, {
                    [PROJECT_BOARD_PARAMS.search]: selectedProject.code,
                    [PROJECT_BOARD_PARAMS.project]: selectedProject.id,
                  })}
                  className={styles.projectLink}
                  title={messages.finance.openOnBoard}
                >
                  {selectedProject.code}
                  <ArrowUpRight />
                </Link>
              )}
            </SheetDescription>
          </SheetHeader>
          <div className={styles.sheetBody}>{selectedFinance && <FinanceOverview finance={selectedFinance} />}</div>
        </SheetContent>
      </Sheet>
    </>
  )
}
