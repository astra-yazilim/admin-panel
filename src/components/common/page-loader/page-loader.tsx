import { Loader2 } from 'lucide-react'
import { messages } from '@/utils/validations/messages'
import styles from './page-loader.module.css'

export function PageLoader() {
  return (
    <div className={styles.root} role="status">
      <Loader2 className={styles.spinner} />
      <span className={styles.label}>{messages.common.loading}</span>
    </div>
  )
}
