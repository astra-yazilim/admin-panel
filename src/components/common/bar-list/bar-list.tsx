import { formatNumber } from '@/utils/validations/formatters'
import styles from './bar-list.module.css'

export interface BarListItem {
  key: string
  label: string
  value: number
  displayValue?: string
}

interface BarListProps {
  items: BarListItem[]
}

export function BarList({ items }: BarListProps) {
  const max = Math.max(1, ...items.map((item) => item.value))
  return (
    <ul className={styles.root}>
      {items.map((item) => {
        const displayValue = item.displayValue ?? formatNumber(item.value)
        return (
          <li key={item.key} className={styles.row} title={`${item.label}: ${displayValue}`}>
            <div className={styles.meta}>
              <span className={styles.label}>{item.label}</span>
              <span className={styles.value}>{displayValue}</span>
            </div>
            <div className={styles.track}>
              <div className={styles.bar} style={{ width: `${(item.value / max) * 100}%` }} />
            </div>
          </li>
        )
      })}
    </ul>
  )
}
