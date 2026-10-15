import { DetailList } from '@/components/common/detail-list/detail-list'
import { StarRating } from '@/components/common/star-rating/star-rating'
import { StatusBadge } from '@/components/common/status-badge/status-badge'
import { UserAvatar } from '@/components/common/user-avatar/user-avatar'
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from '@/components/ui/sheet'
import { useTrainingAssignments, useTrainingModules } from '@/hooks/use-developers'
import { useEntityMap } from '@/hooks/use-entity-map'
import type { Developer, Project, Survey } from '@/types'
import {
  DEVELOPER_TYPE_CONFIG,
  EXPERTISE_LABELS,
  SENIORITY_LABELS,
  TRAINING_SOURCE_LABELS,
  TRAINING_STATUS_CONFIG,
} from '@/utils/validations/constants'
import { formatDate, stripProtocol, toExternalUrl } from '@/utils/validations/formatters'
import { getDeveloperPerformance } from '@/utils/validations/helpers'
import { messages } from '@/utils/validations/messages'
import styles from './developer-profile-sheet.module.css'

interface DeveloperProfileSheetProps {
  developer: Developer | undefined
  surveys: Survey[]
  projects: Project[]
  onOpenChange: (open: boolean) => void
}

const { developers: copy } = messages

export function DeveloperProfileSheet({ developer, surveys, projects, onOpenChange }: DeveloperProfileSheetProps) {
  const { data: assignments = [] } = useTrainingAssignments()
  const { data: modules } = useTrainingModules()
  const moduleMap = useEntityMap(modules)
  const projectMap = useEntityMap(projects)

  const reviews = developer
    ? surveys.filter((survey) => survey.status === 'completed' && survey.developerIds.includes(developer.id))
    : []
  const trainings = assignments.filter((assignment) => assignment.developerId === developer?.id)
  const performance = developer ? getDeveloperPerformance(developer.id, surveys) : undefined

  const link = (url: string) =>
    url ? (
      <a href={toExternalUrl(url)} target="_blank" rel="noreferrer" className={styles.link}>
        {stripProtocol(url)}
      </a>
    ) : (
      messages.common.notSpecified
    )

  return (
    <Sheet open={Boolean(developer)} onOpenChange={onOpenChange}>
      <SheetContent className={styles.content}>
        {developer && performance && (
          <>
            <SheetHeader className={styles.header}>
              <div className={styles.identity}>
                <UserAvatar name={developer.fullName} size="lg" />
                <div>
                  <SheetTitle>{developer.fullName}</SheetTitle>
                  <SheetDescription>{developer.title}</SheetDescription>
                  <div className={styles.badges}>
                    <StatusBadge config={DEVELOPER_TYPE_CONFIG[developer.type]} />
                    <StatusBadge label={SENIORITY_LABELS[developer.seniority]} />
                  </div>
                </div>
              </div>
            </SheetHeader>
            <div className={styles.body}>
              <div className={styles.score}>
                <div>
                  <span className={styles.scoreLabel}>{copy.performanceIndex}</span>
                  <span className={styles.scoreValue}>{performance.reviewCount ? performance.performanceIndex : '—'}</span>
                </div>
                <div className={styles.scoreRating}>
                  <StarRating value={performance.averageRating} size="md" showValue />
                  <span className={styles.muted}>{copy.reviews(performance.reviewCount)}</span>
                </div>
              </div>

              <DetailList
                items={[
                  { label: copy.application.fields.email, value: developer.email },
                  { label: copy.application.fields.phone, value: developer.phone },
                  { label: copy.application.fields.city, value: developer.city },
                  { label: copy.application.fields.createdAt, value: formatDate(developer.joinedAt) },
                  { label: copy.application.fields.githubUrl, value: link(developer.githubUrl) },
                  { label: copy.application.fields.linkedinUrl, value: link(developer.linkedinUrl) },
                ]}
              />

              <section className={styles.section}>
                <h3 className={styles.heading}>{copy.expertise}</h3>
                <div className={styles.chips}>
                  {developer.expertiseAreas.map((area) => (
                    <StatusBadge key={area} label={EXPERTISE_LABELS[area]} tone="primary" />
                  ))}
                </div>
              </section>

              <section className={styles.section}>
                <h3 className={styles.heading}>{copy.techStack}</h3>
                <div className={styles.chips}>
                  {developer.techStack.map((technology) => (
                    <StatusBadge key={technology} label={technology} />
                  ))}
                </div>
              </section>

              <section className={styles.section}>
                <h3 className={styles.heading}>{copy.reviewsTitle}</h3>
                {reviews.length === 0 && <p className={styles.muted}>{copy.noReviews}</p>}
                {reviews.map((review) => (
                  <article key={review.id} className={styles.review}>
                    <div className={styles.reviewHeader}>
                      <span className={styles.reviewProject}>{projectMap.get(review.projectId)?.code}</span>
                      <StarRating value={review.overallRating ?? 0} />
                    </div>
                    {review.comment && <p className={styles.reviewComment}>“{review.comment}”</p>}
                  </article>
                ))}
              </section>

              <section className={styles.section}>
                <h3 className={styles.heading}>{copy.trainingTitle}</h3>
                {trainings.length === 0 && <p className={styles.muted}>{copy.noTraining}</p>}
                {trainings.map((training) => (
                  <article key={training.id} className={styles.review}>
                    <div className={styles.reviewHeader}>
                      <span className={styles.reviewProject}>{moduleMap.get(training.moduleId)?.title}</span>
                      <StatusBadge config={TRAINING_STATUS_CONFIG[training.status]} />
                    </div>
                    <p className={styles.muted}>{training.skillGap}</p>
                    <span className={styles.source}>{TRAINING_SOURCE_LABELS[training.source]}</span>
                  </article>
                ))}
              </section>
            </div>
          </>
        )}
      </SheetContent>
    </Sheet>
  )
}
