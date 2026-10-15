import { DetailList, type DetailItem } from '@/components/common/detail-list/detail-list'
import { useAuth } from '@/hooks/use-auth'
import { PERMISSIONS, type ProjectFinance } from '@/types'
import { BILLING_TYPE_LABELS, CREDIT_UNIT_PRICE, PAYMENT_METHOD_LABELS } from '@/utils/validations/constants'
import { formatCurrency, formatPercent } from '@/utils/validations/formatters'
import { getFinanceSummary } from '@/utils/validations/helpers'
import { messages } from '@/utils/validations/messages'
import { PaymentSchedule } from '../payment-schedule/payment-schedule'
import styles from './finance-overview.module.css'

const { columns, kpi } = messages.finance

export function FinanceOverview({ finance }: { finance: ProjectFinance }) {
  const { can } = useAuth()
  const summary = getFinanceSummary([finance])
  const { advance, milestone, final } = finance.paymentTerms

  const items: DetailItem[] = [
    { label: columns.billing, value: BILLING_TYPE_LABELS[finance.billingType] },
    {
      label: columns.budget,
      value: (
        <span className={styles.stack}>
          <span className={styles.strong}>{formatCurrency(finance.totalBudget)}</span>
          {finance.creditUnits !== undefined && (
            <span className={styles.muted}>
              {messages.finance.creditUnits(finance.creditUnits, formatCurrency(CREDIT_UNIT_PRICE))}
            </span>
          )}
        </span>
      ),
    },
    {
      label: `${columns.terms} (${messages.finance.termsLegend})`,
      value: messages.finance.termsFormat(advance, milestone, final),
    },
    { label: columns.method, value: PAYMENT_METHOD_LABELS[finance.paymentMethod] },
    { label: kpi.collected, value: formatCurrency(summary.collected) },
    { label: kpi.outstanding, value: formatCurrency(summary.outstanding) },
  ]

  if (can(PERMISSIONS.FINANCE_PAYOUTS_VIEW)) {
    items.push(
      {
        label: kpi.payout,
        value: finance.developerPayout ? formatCurrency(finance.developerPayout) : messages.finance.internalTeam,
      },
      { label: kpi.margin, value: `${formatCurrency(summary.margin)} (${formatPercent(summary.marginRate)})` },
    )
  }

  return (
    <div className={styles.root}>
      <DetailList items={items} />
      <section className={styles.section}>
        <h3 className={styles.heading}>{messages.finance.paymentSchedule}</h3>
        <PaymentSchedule finance={finance} />
      </section>
    </div>
  )
}
