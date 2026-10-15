import { BadgeCheck } from 'lucide-react'
import { useEffect, useState } from 'react'
import { SelectField } from '@/components/common/select-field/select-field'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { useApproveApplication, useUpdateApplication } from '@/hooks/use-developers'
import type { ApplicationStatus, DeveloperApplication, SeniorityLevel } from '@/types'
import { APPLICATION_STATUS_CONFIG, SENIORITY_LABELS } from '@/utils/validations/constants'
import { toDateTimeInputValue } from '@/utils/validations/formatters'
import { toOptions, toStatusOptions } from '@/utils/validations/helpers'
import { messages } from '@/utils/validations/messages'
import styles from './application-review.module.css'

const STATUS_OPTIONS = toStatusOptions(APPLICATION_STATUS_CONFIG).filter((option) => option.value !== 'approved')
const SENIORITY_OPTIONS = toOptions(SENIORITY_LABELS)
const { fields } = messages.developers.application

export function ApplicationReview({ application }: { application: DeveloperApplication }) {
  const updateApplication = useUpdateApplication()
  const approveApplication = useApproveApplication()
  const [status, setStatus] = useState<ApplicationStatus>(application.status)
  const [note, setNote] = useState(application.reviewerNote)
  const [interviewAt, setInterviewAt] = useState(toDateTimeInputValue(application.interviewAt))
  const [seniority, setSeniority] = useState<SeniorityLevel>('junior')
  const isPending = updateApplication.isPending || approveApplication.isPending

  useEffect(() => {
    setStatus(application.status)
    setNote(application.reviewerNote)
    setInterviewAt(toDateTimeInputValue(application.interviewAt))
  }, [application])

  const saveStatus = () =>
    updateApplication.mutate({
      id: application.id,
      update: {
        status,
        reviewerNote: note,
        interviewAt: status === 'interview' && interviewAt ? new Date(interviewAt).toISOString() : undefined,
      },
    })

  return (
    <div className={styles.root}>
      <div className={styles.row}>
        <div className={styles.field}>
          <Label htmlFor="application-status">{fields.status}</Label>
          <SelectField<ApplicationStatus> id="application-status" value={status} onValueChange={setStatus} options={STATUS_OPTIONS} />
        </div>
        {status === 'interview' && (
          <div className={styles.field}>
            <Label htmlFor="interview-at">{fields.interviewAt}</Label>
            <Input
              id="interview-at"
              type="datetime-local"
              value={interviewAt}
              onChange={(event) => setInterviewAt(event.target.value)}
            />
          </div>
        )}
      </div>
      <div className={styles.field}>
        <Label htmlFor="reviewer-note">{fields.reviewerNote}</Label>
        <Textarea
          id="reviewer-note"
          rows={3}
          value={note}
          onChange={(event) => setNote(event.target.value)}
          placeholder={messages.developers.application.reviewerNotePlaceholder}
        />
      </div>
      <Button variant="outline" onClick={saveStatus} disabled={isPending} className={styles.save}>
        {messages.developers.application.updateStatus}
      </Button>

      <div className={styles.approve}>
        <div className={styles.field}>
          <Label htmlFor="approve-seniority">{fields.seniority}</Label>
          <SelectField<SeniorityLevel>
            id="approve-seniority"
            value={seniority}
            onValueChange={setSeniority}
            options={SENIORITY_OPTIONS}
          />
        </div>
        <Button
          onClick={() => approveApplication.mutate({ application, seniority, reviewerNote: note })}
          disabled={isPending}
        >
          <BadgeCheck />
          {messages.developers.application.approve}
        </Button>
      </div>
    </div>
  )
}
