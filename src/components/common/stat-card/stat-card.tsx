import type { LucideIcon } from 'lucide-react'
import { Card } from '@/components/ui/card'
import { cn } from '@/lib/utils'
import styles from './stat-card.module.css'

type StatTone = 'primary' | 'gold' | 'info' | 'danger'

interface StatCardProps {
  label: string
  value: string | number
  hint?: string
  icon: LucideIcon
  tone?: StatTone
}

export function StatCard({ label, value, hint, icon: Icon, tone = 'primary' }: StatCardProps) {
  return (
    <Card className={styles.root}>
      <div className={styles.header}>
        <span className={styles.label}>{label}</span>
        <span className={cn(styles.icon, styles[tone])}>
          <Icon />
        </span>
      </div>
      <p className={styles.value}>{value}</p>
      {hint && <p className={styles.hint}>{hint}</p>}
    </Card>
  )
}
