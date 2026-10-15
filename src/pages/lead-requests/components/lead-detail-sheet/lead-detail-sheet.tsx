import { ArrowRightLeft, ExternalLink, ShieldCheck, ShieldX } from 'lucide-react'
import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { DetailList } from '@/components/common/detail-list/detail-list'
import { SelectField } from '@/components/common/select-field/select-field'
import { StatusBadge } from '@/components/common/status-badge/status-badge'
import { Button } from '@/components/ui/button'
import { Sheet, SheetContent, SheetDescription, SheetFooter, SheetHeader, SheetTitle } from '@/components/ui/sheet'
import { Textarea } from '@/components/ui/textarea'
import { useAuth } from '@/hooks/use-auth'
import { useUpdateLeadNote, useUpdateLeadStatus } from '@/hooks/use-leads'
import { PERMISSIONS, type Lead, type LeadStatus } from '@/types'
import { LEAD_STATUS_CONFIG, ROUTE_PATHS, SERVICE_LABELS } from '@/utils/validations/constants'
import { buildPath, formatDateTime, stripProtocol, toExternalUrl } from '@/utils/validations/formatters'
import { toStatusOptions } from '@/utils/validations/helpers'
import { messages } from '@/utils/validations/messages'
import styles from './lead-detail-sheet.module.css'

const STATUS_OPTIONS = toStatusOptions(LEAD_STATUS_CONFIG)
const { fields } = messages.leads

interface LeadDetailSheetProps {
  lead: Lead | undefined
  onOpenChange: (open: boolean) => void
  onConvert: (lead: Lead) => void
}

export function LeadDetailSheet({ lead, onOpenChange, onConvert }: LeadDetailSheetProps) {
  const { can } = useAuth()
  const updateStatus = useUpdateLeadStatus()
  const updateNote = useUpdateLeadNote()
  const [note, setNote] = useState('')
  const canWrite = can(PERMISSIONS.LEADS_WRITE)
  const canConvert = can(PERMISSIONS.PROJECTS_WRITE) && lead && !lead.convertedProjectId && lead.status !== 'rejected'

  useEffect(() => setNote(lead?.internalNote ?? ''), [lead?.id, lead?.internalNote])

  return (
    <Sheet open={Boolean(lead)} onOpenChange={onOpenChange}>
      <SheetContent className={styles.content}>
        {lead && (
          <>
            <SheetHeader className={styles.header}>
              <StatusBadge config={LEAD_STATUS_CONFIG[lead.status]} className={styles.badge} />
              <SheetTitle>{lead.companyName || lead.fullName}</SheetTitle>
              <SheetDescription>{SERVICE_LABELS[lead.service]}</SheetDescription>
            </SheetHeader>
            <div className={styles.body}>
              <DetailList
                items={[
                  { label: fields.fullName, value: lead.fullName },
                  { label: fields.email, value: <a href={`mailto:${lead.email}`} className={styles.link}>{lead.email}</a> },
                  { label: fields.phone, value: <a href={`tel:${lead.phone}`} className={styles.link}>{lead.phone}</a> },
                  {
                    label: fields.website,
                    value: lead.website ? (
                      <a href={toExternalUrl(lead.website)} target="_blank" rel="noreferrer" className={styles.link}>
                        {stripProtocol(lead.website)}
                        <ExternalLink />
                      </a>
                    ) : (
                      messages.common.notSpecified
                    ),
                  },
                  { label: fields.createdAt, value: formatDateTime(lead.createdAt) },
                  {
                    label: fields.kvkkConsent,
                    value: (
                      <span className={lead.kvkkConsent ? styles.consent : styles.noConsent}>
                        {lead.kvkkConsent ? <ShieldCheck /> : <ShieldX />}
                        {lead.kvkkConsent ? messages.leads.kvkkGiven : messages.leads.kvkkMissing}
                      </span>
                    ),
                  },
                ]}
              />
              <section className={styles.section}>
                <h3 className={styles.heading}>{fields.message}</h3>
                <p className={styles.message}>{lead.message}</p>
              </section>
              {canWrite && (
                <section className={styles.section}>
                  <h3 className={styles.heading}>{fields.status}</h3>
                  <SelectField<LeadStatus>
                    value={lead.status}
                    onValueChange={(status) => updateStatus.mutate({ id: lead.id, status })}
                    options={STATUS_OPTIONS}
                    disabled={updateStatus.isPending || Boolean(lead.convertedProjectId)}
                  />
                </section>
              )}
              <section className={styles.section}>
                <h3 className={styles.heading}>{fields.internalNote}</h3>
                <Textarea
                  value={note}
                  onChange={(event) => setNote(event.target.value)}
                  placeholder={messages.leads.placeholders.internalNote}
                  readOnly={!canWrite}
                  rows={4}
                />
                {canWrite && (
                  <Button
                    size="sm"
                    variant="outline"
                    className={styles.saveNote}
                    disabled={note === lead.internalNote || updateNote.isPending}
                    onClick={() => updateNote.mutate({ id: lead.id, note })}
                  >
                    {messages.leads.saveNote}
                  </Button>
                )}
              </section>
            </div>
            {(canConvert || lead.convertedProjectId) && (
              <SheetFooter className={styles.footer}>
                {lead.convertedProjectId ? (
                  <Button asChild variant="outline">
                    <Link to={buildPath(ROUTE_PATHS.projectDetail, { projectId: lead.convertedProjectId })}>
                      {messages.leads.goToProject}
                    </Link>
                  </Button>
                ) : (
                  <Button onClick={() => onConvert(lead)}>
                    <ArrowRightLeft />
                    {messages.leads.convertToProject}
                  </Button>
                )}
              </SheetFooter>
            )}
          </>
        )}
      </SheetContent>
    </Sheet>
  )
}
