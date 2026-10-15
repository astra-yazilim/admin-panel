import { CheckCircle2, Download, FileText, XCircle } from 'lucide-react'
import type { ReactNode } from 'react'
import { DetailList } from '@/components/common/detail-list/detail-list'
import { StatusBadge } from '@/components/common/status-badge/status-badge'
import { Button } from '@/components/ui/button'
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from '@/components/ui/sheet'
import { useAuth } from '@/hooks/use-auth'
import { PERMISSIONS, type DeveloperApplication } from '@/types'
import {
  APPLICATION_STATUS_CONFIG,
  EXPERIENCE_LABELS,
  EXPERTISE_LABELS,
  WEEKLY_AVAILABILITY_LABELS,
  WORK_MODEL_LABELS,
} from '@/utils/validations/constants'
import { formatDateTime, formatFileSize, stripProtocol, toExternalUrl } from '@/utils/validations/formatters'
import { messages } from '@/utils/validations/messages'
import { ApplicationReview } from '../application-review/application-review'
import styles from './application-detail-sheet.module.css'

const { sections, fields } = messages.developers.application

function Section({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section className={styles.section}>
      <h3 className={styles.heading}>{title}</h3>
      {children}
    </section>
  )
}

function Consent({ label, accepted }: { label: string; accepted: boolean }) {
  return (
    <li className={accepted ? styles.accepted : styles.rejected}>
      {accepted ? <CheckCircle2 /> : <XCircle />}
      <span>{label}</span>
    </li>
  )
}

interface ApplicationDetailSheetProps {
  application: DeveloperApplication | undefined
  onOpenChange: (open: boolean) => void
}

export function ApplicationDetailSheet({ application, onOpenChange }: ApplicationDetailSheetProps) {
  const { can } = useAuth()
  const canReview = can(PERMISSIONS.DEVELOPERS_APPROVE) && application && application.status !== 'approved'

  const link = (url: string) =>
    url ? (
      <a href={toExternalUrl(url)} target="_blank" rel="noreferrer" className={styles.link}>
        {stripProtocol(url)}
      </a>
    ) : (
      messages.common.notSpecified
    )

  return (
    <Sheet open={Boolean(application)} onOpenChange={onOpenChange}>
      <SheetContent className={styles.content}>
        {application && (
          <>
            <SheetHeader className={styles.header}>
              <StatusBadge config={APPLICATION_STATUS_CONFIG[application.status]} className={styles.badge} />
              <SheetTitle>{application.fullName}</SheetTitle>
              <SheetDescription>
                {application.title} · {formatDateTime(application.createdAt)}
              </SheetDescription>
            </SheetHeader>
            <div className={styles.body}>
              <Section title={sections.personal}>
                <DetailList
                  items={[
                    { label: fields.fullName, value: application.fullName },
                    { label: fields.email, value: application.email },
                    { label: fields.phone, value: application.phone },
                    { label: fields.city, value: application.city || messages.common.notSpecified },
                  ]}
                />
              </Section>

              <Section title={sections.profile}>
                <DetailList
                  items={[
                    { label: fields.title, value: application.title },
                    { label: fields.experience, value: EXPERIENCE_LABELS[application.experience] },
                  ]}
                />
                <div className={styles.field}>
                  <span className={styles.label}>{fields.expertiseAreas}</span>
                  <div className={styles.chips}>
                    {application.expertiseAreas.map((area) => (
                      <StatusBadge key={area} label={EXPERTISE_LABELS[area]} tone="primary" />
                    ))}
                  </div>
                </div>
                <div className={styles.field}>
                  <span className={styles.label}>{fields.otherTechnologies}</span>
                  <span className={styles.value}>{application.otherTechnologies || messages.common.notSpecified}</span>
                </div>
              </Section>

              <Section title={sections.links}>
                <DetailList
                  items={[
                    { label: fields.linkedinUrl, value: link(application.linkedinUrl) },
                    { label: fields.githubUrl, value: link(application.githubUrl) },
                    { label: fields.portfolioUrl, value: link(application.portfolioUrl) },
                  ]}
                />
                <div className={styles.cv}>
                  <FileText />
                  <span className={styles.cvName}>
                    {application.cv.fileName}
                    <span className={styles.cvSize}>{formatFileSize(application.cv.fileSize)}</span>
                  </span>
                  <Button asChild size="sm" variant="outline">
                    <a href={application.cv.url} download>
                      <Download />
                      {messages.developers.application.download}
                    </a>
                  </Button>
                </div>
              </Section>

              <Section title={sections.preferences}>
                <DetailList
                  items={[
                    {
                      label: fields.workModels,
                      value: application.workModels.map((model) => WORK_MODEL_LABELS[model]).join(', '),
                    },
                    { label: fields.weeklyAvailability, value: WEEKLY_AVAILABILITY_LABELS[application.weeklyAvailability] },
                    { label: fields.expectedRate, value: application.expectedRate || messages.common.notSpecified },
                  ]}
                />
                <div className={styles.field}>
                  <span className={styles.label}>{fields.about}</span>
                  <p className={styles.about}>{application.about || messages.common.notSpecified}</p>
                </div>
              </Section>

              <Section title={sections.consents}>
                <ul className={styles.consents}>
                  <Consent label={fields.privacyConsent} accepted={application.privacyConsent} />
                  <Consent label={fields.agreementConsent} accepted={application.agreementConsent} />
                </ul>
              </Section>

              {canReview ? (
                <Section title={sections.review}>
                  <ApplicationReview application={application} />
                </Section>
              ) : (
                application.reviewerNote && (
                  <Section title={sections.review}>
                    <p className={styles.about}>{application.reviewerNote}</p>
                  </Section>
                )
              )}
            </div>
          </>
        )}
      </SheetContent>
    </Sheet>
  )
}
