import { CheckCircle2 } from 'lucide-react'
import { StatusBadge } from '@/components/common/status-badge/status-badge'
import { Button } from '@/components/ui/button'
import { useAuth } from '@/hooks/use-auth'
import { useMarkPaymentPaid } from '@/hooks/use-finance'
import { PERMISSIONS, type ProjectFinance } from '@/types'
import { PAYMENT_STAGE_LABELS, PAYMENT_STATUS_CONFIG } from '@/utils/validations/constants'
import { formatCurrency, formatDate } from '@/utils/validations/formatters'
import { messages } from '@/utils/validations/messages'
import styles from './payment-schedule.module.css'

export function PaymentSchedule({ finance }: { finance: ProjectFinance }) {
  const { can } = useAuth()
  const markPaid = useMarkPaymentPaid()
  const canWrite = can(PERMISSIONS.FINANCE_WRITE)

  return (
    <ol className={styles.root}>
      {finance.payments.map((payment) => (
        <li key={payment.stage} className={styles.item}>
          <div className={styles.main}>
            <span className={styles.stage}>
              {PAYMENT_STAGE_LABELS[payment.stage]} · %{finance.paymentTerms[payment.stage]}
            </span>
            <span className={styles.date}>
              {payment.paidAt ? messages.finance.paidAt(formatDate(payment.paidAt)) : messages.finance.dueAt(formatDate(payment.dueDate))}
            </span>
          </div>
          <span className={styles.amount}>{formatCurrency(payment.amount)}</span>
          <StatusBadge config={PAYMENT_STATUS_CONFIG[payment.status]} />
          {canWrite && payment.status !== 'paid' && (
            <Button
              size="sm"
              variant="outline"
              disabled={markPaid.isPending}
              onClick={() => markPaid.mutate({ id: finance.id, stage: payment.stage })}
            >
              <CheckCircle2 />
              {messages.finance.markPaid}
            </Button>
          )}
        </li>
      ))}
    </ol>
  )
}
