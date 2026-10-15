import type { ReactNode } from 'react'
import styles from './detail-list.module.css'

export interface DetailItem {
  label: string
  value: ReactNode
}

interface DetailListProps {
  items: DetailItem[]
}

export function DetailList({ items }: DetailListProps) {
  return (
    <dl className={styles.root}>
      {items.map((item) => (
        <div key={item.label} className={styles.item}>
          <dt className={styles.label}>{item.label}</dt>
          <dd className={styles.value}>{item.value}</dd>
        </div>
      ))}
    </dl>
  )
}
