import { Check, Copy } from 'lucide-react'
import { useState } from 'react'
import { Button } from '@/components/ui/button'
import type { IssuedAccess } from '@/services/auth.service'
import { ACCESS_METHOD_LABELS } from '@/utils/validations/constants'
import { formatDateTime } from '@/utils/validations/formatters'
import { messages } from '@/utils/validations/messages'
import styles from './access-credentials.module.css'

const COPIED_RESET_MS = 2000
const { access: copy } = messages.investors

export function AccessCredentials({ access }: { access: IssuedAccess }) {
  const [isCopied, setCopied] = useState(false)

  const copySecret = async () => {
    await navigator.clipboard.writeText(access.secret)
    setCopied(true)
    setTimeout(() => setCopied(false), COPIED_RESET_MS)
  }

  return (
    <div className={styles.root}>
      <span className={styles.label}>{ACCESS_METHOD_LABELS[access.method]}</span>
      <div className={styles.secretRow}>
        <code className={styles.secret}>{access.secret}</code>
        <Button type="button" size="sm" variant="outline" onClick={copySecret}>
          {isCopied ? <Check /> : <Copy />}
          {isCopied ? copy.copied : copy.copy}
        </Button>
      </div>
      <span className={styles.muted}>{copy.expiresAt(formatDateTime(access.expiresAt))}</span>
      <p className={styles.notice}>{copy.mockNotice}</p>
    </div>
  )
}
