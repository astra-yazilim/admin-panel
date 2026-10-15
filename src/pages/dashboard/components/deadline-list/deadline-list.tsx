import { Link } from 'react-router-dom'
import { StatusBadge } from '@/components/common/status-badge/status-badge'
import { cn } from '@/lib/utils'
import type { Project } from '@/types'
import { PRIORITY_CONFIG, ROUTE_PATHS } from '@/utils/validations/constants'
import { buildPath, formatDate, formatRelativeDate } from '@/utils/validations/formatters'
import { daysUntil } from '@/utils/validations/helpers'
import { messages } from '@/utils/validations/messages'
import styles from './deadline-list.module.css'

const MAX_ITEMS = 6

export function DeadlineList({ projects }: { projects: Project[] }) {
  if (projects.length === 0) return <p className={styles.empty}>{messages.dashboard.deadlinesEmpty}</p>

  return (
    <ul className={styles.root}>
      {projects.slice(0, MAX_ITEMS).map((project) => {
        const isOverdue = daysUntil(project.dueDate) < 0
        return (
          <li key={project.id}>
            <Link to={buildPath(ROUTE_PATHS.projectDetail, { projectId: project.id })} className={styles.item}>
              <div className={styles.main}>
                <span className={styles.code}>{project.code}</span>
                <span className={styles.title}>{project.title}</span>
              </div>
              <div className={styles.meta}>
                <StatusBadge config={PRIORITY_CONFIG[project.priority]} />
                <span className={cn(styles.due, isOverdue && styles.overdue)} title={formatDate(project.dueDate)}>
                  {isOverdue ? messages.projects.overdue : formatRelativeDate(project.dueDate)}
                </span>
              </div>
            </Link>
          </li>
        )
      })}
    </ul>
  )
}
