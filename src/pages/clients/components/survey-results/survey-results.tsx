import { MessageSquareQuote } from 'lucide-react'
import { AvatarGroup } from '@/components/common/avatar-group/avatar-group'
import { EmptyState } from '@/components/common/empty-state/empty-state'
import { StarRating } from '@/components/common/star-rating/star-rating'
import { StatusBadge } from '@/components/common/status-badge/status-badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import type { Client, Developer, Project, Survey } from '@/types'
import { SURVEY_STATUS_CONFIG } from '@/utils/validations/constants'
import { formatDate, formatPercent } from '@/utils/validations/formatters'
import { average } from '@/utils/validations/helpers'
import { messages } from '@/utils/validations/messages'
import styles from './survey-results.module.css'

interface SurveyResultsProps {
  surveys: Survey[]
  projects: Map<string, Project>
  clients: Map<string, Client>
  developers: Map<string, Developer>
}

const { survey: copy } = messages.clients

export function SurveyResults({ surveys, projects, clients, developers }: SurveyResultsProps) {
  const completed = surveys.filter((survey) => survey.status === 'completed')
  const sorted = [...surveys].sort((a, b) => b.sentAt.localeCompare(a.sentAt))

  const scores = [
    { key: 'overall', label: copy.overall, value: average(completed.map((s) => s.overallRating ?? 0)) },
    { key: 'communication', label: copy.communication, value: average(completed.map((s) => s.communicationScore ?? 0)) },
    { key: 'technical', label: copy.technical, value: average(completed.map((s) => s.technicalScore ?? 0)) },
  ]

  if (surveys.length === 0) return <EmptyState icon={MessageSquareQuote} title={copy.empty} />

  return (
    <div className={styles.root}>
      <Card className={styles.summary}>
        <CardHeader>
          <CardTitle>{copy.summary}</CardTitle>
        </CardHeader>
        <CardContent className={styles.scores}>
          {scores.map((score) => (
            <div key={score.key} className={styles.score}>
              <span className={styles.scoreLabel}>{score.label}</span>
              <StarRating value={score.value} size="md" showValue />
            </div>
          ))}
          <div className={styles.score}>
            <span className={styles.scoreLabel}>{copy.responseRate}</span>
            <span className={styles.rate}>
              {formatPercent(completed.length / surveys.length)}
              <span className={styles.muted}>
                {completed.length} / {surveys.length}
              </span>
            </span>
          </div>
        </CardContent>
      </Card>

      <ul className={styles.list}>
        {sorted.map((survey) => {
          const project = projects.get(survey.projectId)
          return (
            <li key={survey.id} className={styles.item}>
              <div className={styles.itemHeader}>
                <div className={styles.itemTitle}>
                  <span className={styles.code}>{project?.code}</span>
                  <span className={styles.client}>{clients.get(survey.clientId)?.companyName}</span>
                </div>
                <StatusBadge config={SURVEY_STATUS_CONFIG[survey.status]} />
              </div>
              {survey.status === 'completed' ? (
                <>
                  <dl className={styles.metrics}>
                    <div>
                      <dt>{copy.overall}</dt>
                      <dd><StarRating value={survey.overallRating ?? 0} /></dd>
                    </div>
                    <div>
                      <dt>{copy.communication}</dt>
                      <dd><StarRating value={survey.communicationScore ?? 0} /></dd>
                    </div>
                    <div>
                      <dt>{copy.technical}</dt>
                      <dd><StarRating value={survey.technicalScore ?? 0} /></dd>
                    </div>
                  </dl>
                  <p className={styles.comment}>{survey.comment ? `“${survey.comment}”` : copy.noComment}</p>
                </>
              ) : (
                <p className={styles.muted}>{messages.clients.surveySentAt(formatDate(survey.sentAt))}</p>
              )}
              <div className={styles.developers}>
                <span className={styles.muted}>{copy.developers}</span>
                <AvatarGroup names={survey.developerIds.map((id) => developers.get(id)?.fullName ?? id)} />
              </div>
            </li>
          )
        })}
      </ul>
    </div>
  )
}
