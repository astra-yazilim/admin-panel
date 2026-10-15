import { Progress } from '@/components/ui/progress'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import type { Client, Project, ProjectFinance } from '@/types'
import { BILLING_TYPE_LABELS, PAYMENT_METHOD_LABELS } from '@/utils/validations/constants'
import { formatCurrency, formatPercent } from '@/utils/validations/formatters'
import { getFinanceSummary } from '@/utils/validations/helpers'
import { messages } from '@/utils/validations/messages'
import styles from './finance-table.module.css'

interface FinanceTableProps {
  finances: ProjectFinance[]
  projects: Map<string, Project>
  clients: Map<string, Client>
  showPayouts: boolean
  onSelect: (finance: ProjectFinance) => void
}

const { columns } = messages.finance

export function FinanceTable({ finances, projects, clients, showPayouts, onSelect }: FinanceTableProps) {
  return (
    <div className={styles.root}>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>{columns.project}</TableHead>
            <TableHead>{columns.billing}</TableHead>
            <TableHead className={styles.numeric}>{columns.budget}</TableHead>
            <TableHead>{columns.terms}</TableHead>
            <TableHead>{columns.method}</TableHead>
            <TableHead>{columns.collected}</TableHead>
            {showPayouts && <TableHead className={styles.numeric}>{columns.payout}</TableHead>}
            {showPayouts && <TableHead className={styles.numeric}>{columns.margin}</TableHead>}
          </TableRow>
        </TableHeader>
        <TableBody>
          {finances.map((finance) => {
            const project = projects.get(finance.projectId)
            const summary = getFinanceSummary([finance])
            const collectedRatio = finance.totalBudget ? summary.collected / finance.totalBudget : 0
            const { advance, milestone, final } = finance.paymentTerms
            return (
              <TableRow key={finance.id} className={styles.row} onClick={() => onSelect(finance)}>
                <TableCell>
                  <span className={styles.project}>
                    <span className={styles.code}>{project?.code}</span>
                    <span className={styles.title}>{project?.title}</span>
                    <span className={styles.client}>{clients.get(project?.clientId ?? '')?.companyName}</span>
                  </span>
                </TableCell>
                <TableCell>{BILLING_TYPE_LABELS[finance.billingType]}</TableCell>
                <TableCell className={styles.numeric}>{formatCurrency(finance.totalBudget)}</TableCell>
                <TableCell className={styles.terms}>{messages.finance.termsFormat(advance, milestone, final)}</TableCell>
                <TableCell>{PAYMENT_METHOD_LABELS[finance.paymentMethod]}</TableCell>
                <TableCell>
                  <span className={styles.collected}>
                    <Progress value={collectedRatio * 100} className={styles.progress} />
                    <span className={styles.ratio}>{formatPercent(collectedRatio)}</span>
                  </span>
                </TableCell>
                {showPayouts && (
                  <TableCell className={styles.numeric}>
                    {finance.developerPayout ? formatCurrency(finance.developerPayout) : messages.finance.internalTeam}
                  </TableCell>
                )}
                {showPayouts && (
                  <TableCell className={styles.numeric}>
                    <span className={styles.margin}>{formatCurrency(summary.margin)}</span>
                    <span className={styles.ratio}>{formatPercent(summary.marginRate)}</span>
                  </TableCell>
                )}
              </TableRow>
            )
          })}
        </TableBody>
      </Table>
    </div>
  )
}
