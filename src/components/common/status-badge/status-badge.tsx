import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'
import type { BadgeTone, StatusConfig } from '@/types'
import styles from './status-badge.module.css'

interface StatusBadgeProps {
  config?: StatusConfig
  label?: string
  tone?: BadgeTone
  className?: string
}

export function StatusBadge({ config, label, tone, className }: StatusBadgeProps) {
  const resolvedTone = config?.tone ?? tone ?? 'neutral'
  return (
    <Badge variant="outline" className={cn(styles.root, styles[resolvedTone], className)}>
      {config?.label ?? label}
    </Badge>
  )
}
