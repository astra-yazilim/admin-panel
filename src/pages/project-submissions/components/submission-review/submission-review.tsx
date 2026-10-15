import { ArrowRightLeft, Sparkles } from 'lucide-react'
import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { SelectField } from '@/components/common/select-field/select-field'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { useAuth } from '@/hooks/use-auth'
import { useUpdateSubmissionReview } from '@/hooks/use-project-submissions'
import { PERMISSIONS, type ProjectSubmission, type SubmissionStatus } from '@/types'
import { ROUTE_PATHS, SUBMISSION_STATUS_CONFIG } from '@/utils/validations/constants'
import { buildPath } from '@/utils/validations/formatters'
import { toStatusOptions } from '@/utils/validations/helpers'
import { messages } from '@/utils/validations/messages'
import styles from './submission-review.module.css'

const STATUS_OPTIONS = toStatusOptions(SUBMISSION_STATUS_CONFIG)
const { review: copy } = messages.submissions

interface SubmissionReviewProps {
  submission: ProjectSubmission
  onConvert: () => void
  onCreateOpportunity: () => void
}

export function SubmissionReview({ submission, onConvert, onCreateOpportunity }: SubmissionReviewProps) {
  const { can } = useAuth()
  const updateReview = useUpdateSubmissionReview()
  const [status, setStatus] = useState<SubmissionStatus>(submission.status)
  const [note, setNote] = useState(submission.reviewerNote)

  useEffect(() => {
    setStatus(submission.status)
    setNote(submission.reviewerNote)
  }, [submission])

  return (
    <div className={styles.root}>
      <div className={styles.field}>
        <Label htmlFor="submission-status">{copy.status}</Label>
        <SelectField<SubmissionStatus> id="submission-status" value={status} onValueChange={setStatus} options={STATUS_OPTIONS} />
      </div>
      <div className={styles.field}>
        <Label htmlFor="submission-note">{copy.note}</Label>
        <Textarea
          id="submission-note"
          rows={4}
          value={note}
          onChange={(event) => setNote(event.target.value)}
          placeholder={copy.notePlaceholder}
        />
      </div>
      <div className={styles.actions}>
        <Button
          variant="outline"
          disabled={updateReview.isPending}
          onClick={() => updateReview.mutate({ id: submission.id, review: { status, reviewerNote: note } })}
        >
          {copy.save}
        </Button>
        {can(PERMISSIONS.OPPORTUNITIES_MANAGE) && !submission.opportunityId && (
          <Button variant="outline" onClick={onCreateOpportunity}>
            <Sparkles />
            {copy.createOpportunity}
          </Button>
        )}
        {submission.convertedProjectId ? (
          <Button asChild>
            <Link to={buildPath(ROUTE_PATHS.projectDetail, { projectId: submission.convertedProjectId })}>
              {copy.goToProject}
            </Link>
          </Button>
        ) : (
          can(PERMISSIONS.PROJECTS_WRITE) && (
            <Button onClick={onConvert}>
              <ArrowRightLeft />
              {copy.convert}
            </Button>
          )
        )}
      </div>
    </div>
  )
}
