import { UserAvatar } from '@/components/common/user-avatar/user-avatar'
import { DEMO_PASSWORD, MOCK_USERS } from '@/mock/users.mock'
import { ROLE_LABELS } from '@/utils/validations/constants'
import { messages } from '@/utils/validations/messages'
import styles from './demo-accounts.module.css'

interface DemoAccountsProps {
  onSelect: (email: string, password: string) => void
}

export function DemoAccounts({ onSelect }: DemoAccountsProps) {
  return (
    <section className={styles.root}>
      <div className={styles.header}>
        <span className={styles.title}>{messages.auth.demoAccounts}</span>
        <span className={styles.hint}>{messages.auth.demoHint(DEMO_PASSWORD)}</span>
      </div>
      <ul className={styles.list}>
        {MOCK_USERS.map((user) => (
          <li key={user.id}>
            <button type="button" className={styles.account} onClick={() => onSelect(user.email, DEMO_PASSWORD)}>
              <UserAvatar name={user.fullName} size="sm" />
              <span className={styles.identity}>
                <span className={styles.name}>{user.fullName}</span>
                <span className={styles.role}>{ROLE_LABELS[user.role]}</span>
              </span>
            </button>
          </li>
        ))}
      </ul>
    </section>
  )
}
