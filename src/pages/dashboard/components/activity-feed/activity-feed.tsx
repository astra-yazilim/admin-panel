import { UserAvatar } from '@/components/common/user-avatar/user-avatar'
import type { Project } from '@/types'
import { formatRelativeDate } from '@/utils/validations/formatters'
import { messages } from '@/utils/validations/messages'
import styles from './activity-feed.module.css'

const MAX_ITEMS = 6

export function ActivityFeed({ projects }: { projects: Project[] }) {
  const entries = projects
    .flatMap((project) => project.activity.map((entry) => ({ ...entry, projectCode: project.code })))
    .sort((a, b) => b.createdAt.localeCompare(a.createdAt))
    .slice(0, MAX_ITEMS)

  if (entries.length === 0) return <p className={styles.empty}>{messages.dashboard.recentActivityEmpty}</p>

  return (
    <ul className={styles.root}>
      {entries.map((entry) => (
        <li key={entry.id} className={styles.item}>
          <UserAvatar name={entry.authorName} size="sm" />
          <div className={styles.body}>
            <p className={styles.message}>
              <span className={styles.author}>{entry.authorName}</span> {entry.message}
            </p>
            <p className={styles.meta}>
              {entry.projectCode} · {formatRelativeDate(entry.createdAt)}
            </p>
          </div>
        </li>
      ))}
    </ul>
  )
}
