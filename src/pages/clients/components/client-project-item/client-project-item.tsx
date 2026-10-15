import { Send } from 'lucide-react'
import { StarRating } from '@/components/common/star-rating/star-rating'
import { StatusBadge } from '@/components/common/status-badge/status-badge'
import { Button } from '@/components/ui/button'
import type { Project, Survey } from '@/types'
import { PROJECT_STATUS_CONFIG, SURVEY_STATUS_CONFIG } from '@/utils/validations/constants'
import { formatDate } from '@/utils/validations/formatters'
import { messages } from '@/utils/validations/messages'
import styles from './client-project-item.module.css'

interface ClientProjectItemProps {
  project: Project
  survey: Survey | undefined
  canSendSurvey: boolean
  onSendSurvey: () => void
}

export function ClientProjectItem({ project, survey, canSendSurvey, onSendSurvey }: ClientProjectItemProps) {
  const isSurveyAvailable = project.status === 'live' && !survey

  return (
    <li className={styles.root}>
      <div className={styles.main}>
        <span className={styles.code}>{project.code}</span>
        <span className={styles.title}>{project.title}</span>
      </div>
      <div className={styles.meta}>
        <StatusBadge config={PROJECT_STATUS_CONFIG[project.status]} />
        {survey && <StatusBadge config={SURVEY_STATUS_CONFIG[survey.status]} />}
        {survey?.status === 'completed' && <StarRating value={survey.overallRating ?? 0} />}
        {survey?.status === 'sent' && (
          <span className={styles.hint}>{messages.clients.surveySentAt(formatDate(survey.sentAt))}</span>
        )}
        {isSurveyAvailable && canSendSurvey && (
          <Button size="sm" onClick={onSendSurvey}>
            <Send />
            {messages.clients.sendSurvey}
          </Button>
        )}
      </div>
    </li>
  )
}
