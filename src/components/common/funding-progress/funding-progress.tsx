import { Progress } from '@/components/ui/progress'
import { formatCompactCurrency, formatPercent } from '@/utils/validations/formatters'
import { messages } from '@/utils/validations/messages'
import styles from './funding-progress.module.css'

interface FundingProgressProps {
  committed: number
  target: number
}

export function FundingProgress({ committed, target }: FundingProgressProps) {
  const ratio = target ? Math.min(committed / target, 1) : 0
  return (
    <div className={styles.root}>
      <div className={styles.meta}>
        <span className={styles.amount}>{formatCompactCurrency(committed)}</span>
        <span className={styles.muted}>
          {formatPercent(ratio)} {messages.opportunities.funded}
        </span>
      </div>
      <Progress value={ratio * 100} className={styles.bar} />
      <span className={styles.muted}>
        {messages.opportunities.target}: {formatCompactCurrency(target)}
      </span>
    </div>
  )
}
