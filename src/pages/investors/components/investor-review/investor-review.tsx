import { KeyRound } from 'lucide-react'
import { useEffect, useState } from 'react'
import { SelectField } from '@/components/common/select-field/select-field'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { useApproveInvestor, useUpdateInvestorReview } from '@/hooks/use-investors'
import type { IssuedAccess } from '@/services/auth.service'
import type { AccessMethod, Investor, InvestorStatus } from '@/types'
import { ACCESS_METHOD_LABELS, ACCESS_VALIDITY_HOURS, INVESTOR_STATUS_CONFIG } from '@/utils/validations/constants'
import { toDateTimeInputValue } from '@/utils/validations/formatters'
import { toOptions, toStatusOptions } from '@/utils/validations/helpers'
import { messages } from '@/utils/validations/messages'
import { AccessCredentials } from '../access-credentials/access-credentials'
import styles from './investor-review.module.css'

const STATUS_OPTIONS = toStatusOptions(INVESTOR_STATUS_CONFIG).filter((option) => option.value !== 'approved')
const METHOD_OPTIONS = toOptions(ACCESS_METHOD_LABELS)
const { review: copy, access: accessCopy } = messages.investors

export function InvestorReview({ investor }: { investor: Investor }) {
  const updateReview = useUpdateInvestorReview()
  const approveInvestor = useApproveInvestor()
  const [status, setStatus] = useState<InvestorStatus>(investor.status)
  const [note, setNote] = useState(investor.reviewerNote)
  const [meetingAt, setMeetingAt] = useState(toDateTimeInputValue(investor.meetingAt))
  const [isDialogOpen, setDialogOpen] = useState(false)
  const [method, setMethod] = useState<AccessMethod>('one_time_password')
  const [issuedAccess, setIssuedAccess] = useState<IssuedAccess>()
  const isApproved = investor.status === 'approved'

  useEffect(() => {
    setStatus(investor.status)
    setNote(investor.reviewerNote)
    setMeetingAt(toDateTimeInputValue(investor.meetingAt))
  }, [investor])

  const save = () =>
    updateReview.mutate({
      id: investor.id,
      review: {
        status,
        reviewerNote: note,
        meetingAt: status === 'meeting' && meetingAt ? new Date(meetingAt).toISOString() : undefined,
      },
    })

  const approve = () =>
    approveInvestor.mutate(
      { investor, method, reviewerNote: note },
      { onSuccess: ({ access }) => setIssuedAccess(access) },
    )

  const closeDialog = (open: boolean) => {
    setDialogOpen(open)
    if (!open) setIssuedAccess(undefined)
  }

  return (
    <div className={styles.root}>
      {!isApproved && (
        <>
          <div className={styles.row}>
            <div className={styles.field}>
              <Label htmlFor="investor-status">{copy.status}</Label>
              <SelectField<InvestorStatus> id="investor-status" value={status} onValueChange={setStatus} options={STATUS_OPTIONS} />
            </div>
            {status === 'meeting' && (
              <div className={styles.field}>
                <Label htmlFor="investor-meeting">{copy.meetingAt}</Label>
                <Input
                  id="investor-meeting"
                  type="datetime-local"
                  value={meetingAt}
                  onChange={(event) => setMeetingAt(event.target.value)}
                />
              </div>
            )}
          </div>
          <div className={styles.field}>
            <Label htmlFor="investor-note">{copy.note}</Label>
            <Textarea
              id="investor-note"
              rows={3}
              value={note}
              onChange={(event) => setNote(event.target.value)}
              placeholder={copy.notePlaceholder}
            />
          </div>
        </>
      )}
      <div className={styles.actions}>
        {!isApproved && (
          <Button variant="outline" onClick={save} disabled={updateReview.isPending}>
            {copy.save}
          </Button>
        )}
        <Button onClick={() => setDialogOpen(true)}>
          <KeyRound />
          {isApproved ? accessCopy.resend : copy.approve}
        </Button>
      </div>

      <Dialog open={isDialogOpen} onOpenChange={closeDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{issuedAccess ? accessCopy.title : copy.approveTitle}</DialogTitle>
            <DialogDescription>
              {issuedAccess
                ? accessCopy.description(investor.corporateEmail, ACCESS_VALIDITY_HOURS)
                : copy.approveDescription(investor.corporateEmail)}
            </DialogDescription>
          </DialogHeader>
          {issuedAccess ? (
            <AccessCredentials access={issuedAccess} />
          ) : (
            <div className={styles.field}>
              <Label htmlFor="access-method">{copy.accessMethod}</Label>
              <SelectField<AccessMethod> id="access-method" value={method} onValueChange={setMethod} options={METHOD_OPTIONS} />
            </div>
          )}
          <DialogFooter>
            {issuedAccess ? (
              <Button onClick={() => closeDialog(false)}>{messages.common.close}</Button>
            ) : (
              <>
                <Button variant="outline" onClick={() => closeDialog(false)}>
                  {messages.common.cancel}
                </Button>
                <Button onClick={approve} disabled={approveInvestor.isPending}>
                  {copy.confirm}
                </Button>
              </>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
