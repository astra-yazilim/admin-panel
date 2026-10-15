import { cn } from '@/lib/utils'
import styles from './filter-tabs.module.css'

export interface FilterTab<T extends string> {
  value: T
  label: string
  count: number
}

interface FilterTabsProps<T extends string> {
  tabs: FilterTab<T>[]
  value: T
  onChange: (value: T) => void
}

export function FilterTabs<T extends string>({ tabs, value, onChange }: FilterTabsProps<T>) {
  return (
    <div className={styles.root} role="tablist">
      {tabs.map((tab) => (
        <button
          key={tab.value}
          type="button"
          role="tab"
          aria-selected={value === tab.value}
          className={cn(styles.tab, value === tab.value && styles.active)}
          onClick={() => onChange(tab.value)}
        >
          <span>{tab.label}</span>
          <span className={styles.count}>{tab.count}</span>
        </button>
      ))}
    </div>
  )
}
