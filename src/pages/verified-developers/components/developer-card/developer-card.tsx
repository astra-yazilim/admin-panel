import { StarRating } from '@/components/common/star-rating/star-rating'
import { StatusBadge } from '@/components/common/status-badge/status-badge'
import { UserAvatar } from '@/components/common/user-avatar/user-avatar'
import { cn } from '@/lib/utils'
import type { Developer, DeveloperPerformance } from '@/types'
import { DEVELOPER_TYPE_CONFIG, EXPERTISE_LABELS, SENIORITY_LABELS } from '@/utils/validations/constants'
import { messages } from '@/utils/validations/messages'
import styles from './developer-card.module.css'

const MAX_VISIBLE_SKILLS = 4

interface DeveloperCardProps {
  developer: Developer
  performance: DeveloperPerformance
  activeProjectCount: number
  onSelect: () => void
}

export function DeveloperCard({ developer, performance, activeProjectCount, onSelect }: DeveloperCardProps) {
  const { developers } = messages
  return (
    <button type="button" className={styles.root} onClick={onSelect}>
      <div className={styles.header}>
        <UserAvatar name={developer.fullName} size="lg" />
        <div className={styles.identity}>
          <span className={styles.name}>{developer.fullName}</span>
          <span className={styles.title}>{developer.title}</span>
          <span className={styles.badges}>
            <StatusBadge config={DEVELOPER_TYPE_CONFIG[developer.type]} />
            <StatusBadge label={SENIORITY_LABELS[developer.seniority]} />
          </span>
        </div>
        <span
          className={cn(styles.availability, developer.isAvailable && styles.available)}
          title={developer.isAvailable ? developers.available : developers.busy}
        />
      </div>

      <div className={styles.skills}>
        {developer.expertiseAreas.slice(0, MAX_VISIBLE_SKILLS).map((area) => (
          <span key={area} className={styles.skill}>
            {EXPERTISE_LABELS[area]}
          </span>
        ))}
      </div>

      <dl className={styles.stats}>
        <div>
          <dt>{developers.activeProjects}</dt>
          <dd>{activeProjectCount}</dd>
        </div>
        <div>
          <dt>{developers.completedTasks}</dt>
          <dd>{developer.completedTasks}</dd>
        </div>
        <div>
          <dt>{developers.performanceIndex}</dt>
          <dd>{performance.reviewCount ? performance.performanceIndex : '—'}</dd>
        </div>
      </dl>

      <div className={styles.rating}>
        {performance.reviewCount ? (
          <>
            <StarRating value={performance.averageRating} showValue />
            <span className={styles.reviews}>{developers.reviews(performance.reviewCount)}</span>
          </>
        ) : (
          <span className={styles.reviews}>{developers.noReviews}</span>
        )}
      </div>
    </button>
  )
}
