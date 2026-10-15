import { Star } from 'lucide-react'
import { cn } from '@/lib/utils'
import { MAX_RATING } from '@/utils/validations/constants'
import { formatNumber } from '@/utils/validations/formatters'
import styles from './star-rating.module.css'

interface StarRatingProps {
  value: number
  showValue?: boolean
  size?: 'sm' | 'md'
}

export function StarRating({ value, showValue = false, size = 'sm' }: StarRatingProps) {
  const rounded = Math.round(value)
  return (
    <span className={cn(styles.root, styles[size])} aria-label={`${formatNumber(value, 1)} / ${MAX_RATING}`}>
      {Array.from({ length: MAX_RATING }, (_, index) => (
        <Star key={index} className={cn(styles.star, index < rounded && styles.filled)} />
      ))}
      {showValue && <span className={styles.value}>{formatNumber(value, 1)}</span>}
    </span>
  )
}
