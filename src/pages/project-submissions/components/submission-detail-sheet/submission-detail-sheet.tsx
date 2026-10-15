import { ExternalLink, FileSignature } from 'lucide-react'
import type { ReactNode } from 'react'
import { DetailList } from '@/components/common/detail-list/detail-list'
import { StatusBadge } from '@/components/common/status-badge/status-badge'
import { Progress } from '@/components/ui/progress'
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from '@/components/ui/sheet'
import { useAuth } from '@/hooks/use-auth'
import { PERMISSIONS, type ProjectSubmission } from '@/types'
import {
  COLLABORATION_MODEL_LABELS,
  DELIVERY_TIMELINE_LABELS,
  EXISTING_ASSET_LABELS,
  EXPECTED_USERS_LABELS,
  FUNDING_STATUS_LABELS,
  INTEGRATION_LABELS,
  PLATFORM_LABELS,
  PRODUCT_TYPE_LABELS,
  PROJECT_BUDGET_LABELS,
  REFERRAL_COMMISSION_RATE,
  SECTOR_LABELS,
  SUBMISSION_STAGE_LABELS,
  SUBMISSION_STATUS_CONFIG,
} from '@/utils/validations/constants'
import { formatDateTime, formatNumber, stripProtocol, toExternalUrl } from '@/utils/validations/formatters'
import { messages } from '@/utils/validations/messages'
import { SubmissionReview } from '../submission-review/submission-review'
import styles from './submission-detail-sheet.module.css'

const { fields, sections } = messages.applications.project
const { review } = messages.submissions
const COMMISSION = formatNumber(REFERRAL_COMMISSION_RATE * 100)

function Section({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section className={styles.section}>
      <h3 className={styles.heading}>{title}</h3>
      {children}
    </section>
  )
}

function Block({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div className={styles.block}>
      <span className={styles.label}>{label}</span>
      {children}
    </div>
  )
}

interface SubmissionDetailSheetProps {
  submission: ProjectSubmission | undefined
  onOpenChange: (open: boolean) => void
  onConvert: (submission: ProjectSubmission) => void
  onCreateOpportunity: (submission: ProjectSubmission) => void
}

export function SubmissionDetailSheet({ submission, onOpenChange, onConvert, onCreateOpportunity }: SubmissionDetailSheetProps) {
  const { can } = useAuth()

  const link = (url: string) =>
    url ? (
      <a href={toExternalUrl(url)} target="_blank" rel="noreferrer" className={styles.link}>
        {stripProtocol(url)}
        <ExternalLink />
      </a>
    ) : (
      messages.common.notSpecified
    )

  return (
    <Sheet open={Boolean(submission)} onOpenChange={onOpenChange}>
      <SheetContent className={styles.content}>
        {submission && (
          <>
            <SheetHeader className={styles.header}>
              <div className={styles.badges}>
                <StatusBadge config={SUBMISSION_STATUS_CONFIG[submission.status]} />
                {submission.fundingStatus === 'seeking' && <StatusBadge label={review.seekingInvestment} tone="gold" />}
                {submission.ndaRequested && <StatusBadge label={review.ndaRequested} tone="info" />}
              </div>
              <SheetTitle>{submission.projectName}</SheetTitle>
              <SheetDescription>
                {submission.code} · {PRODUCT_TYPE_LABELS[submission.productType]} · {SECTOR_LABELS[submission.sector]}
              </SheetDescription>
            </SheetHeader>
            <div className={styles.body}>
              <Section title={sections.contact}>
                <DetailList
                  items={[
                    { label: fields.fullName, value: submission.fullName },
                    { label: fields.role, value: submission.role },
                    { label: fields.email, value: submission.email },
                    { label: fields.phone, value: submission.phone },
                    { label: fields.companyName, value: submission.companyName || messages.common.notSpecified },
                    { label: fields.linkedinUrl, value: link(submission.linkedinUrl) },
                  ]}
                />
              </Section>

              <Section title={sections.overview}>
                <Block label={fields.summary}>
                  <p className={styles.text}>{submission.summary}</p>
                </Block>
                <Block label={fields.problem}>
                  <p className={styles.callout}>{submission.problem}</p>
                </Block>
                <Block label={fields.targetAudience}>
                  <p className={styles.text}>{submission.targetAudience}</p>
                </Block>
              </Section>

              <Section title={sections.current}>
                <DetailList
                  items={[
                    { label: fields.stage, value: SUBMISSION_STAGE_LABELS[submission.stage] },
                    {
                      label: fields.completionPercent,
                      value: (
                        <span className={styles.progress}>
                          <Progress value={submission.completionPercent} />%{submission.completionPercent}
                        </span>
                      ),
                    },
                    { label: fields.techStack, value: submission.techStack || messages.common.notSpecified },
                    { label: fields.repositoryUrl, value: link(submission.repositoryUrl) },
                  ]}
                />
                <Block label={fields.existingAssets}>
                  <div className={styles.chips}>
                    {submission.existingAssets.length === 0 && <span className={styles.muted}>{messages.common.notSpecified}</span>}
                    {submission.existingAssets.map((asset) => (
                      <StatusBadge key={asset} label={EXISTING_ASSET_LABELS[asset]} />
                    ))}
                  </div>
                </Block>
                {submission.stallReason && (
                  <Block label={fields.stallReason}>
                    <p className={styles.callout}>{submission.stallReason}</p>
                  </Block>
                )}
              </Section>

              <Section title={sections.scope}>
                <Block label={fields.platforms}>
                  <div className={styles.chips}>
                    {submission.platforms.map((platform) => (
                      <StatusBadge key={platform} label={PLATFORM_LABELS[platform]} tone="primary" />
                    ))}
                  </div>
                </Block>
                <Block label={fields.coreFeatures}>
                  <ul className={styles.features}>
                    {submission.coreFeatures.split('\n').filter(Boolean).map((feature) => (
                      <li key={feature}>{feature}</li>
                    ))}
                  </ul>
                </Block>
                <Block label={fields.integrations}>
                  <div className={styles.chips}>
                    {submission.integrations.length === 0 && <span className={styles.muted}>{messages.common.notSpecified}</span>}
                    {submission.integrations.map((integration) => (
                      <StatusBadge key={integration} label={INTEGRATION_LABELS[integration]} />
                    ))}
                  </div>
                </Block>
                <DetailList
                  items={[
                    { label: fields.expectedUsers, value: EXPECTED_USERS_LABELS[submission.expectedUsers] },
                    {
                      label: fields.technicalRequirements,
                      value: submission.technicalRequirements || messages.common.notSpecified,
                    },
                  ]}
                />
              </Section>

              <Section title={sections.budget}>
                <DetailList
                  items={[
                    { label: fields.budgetRange, value: PROJECT_BUDGET_LABELS[submission.budgetRange] },
                    { label: fields.timeline, value: DELIVERY_TIMELINE_LABELS[submission.timeline] },
                    { label: fields.fundingStatus, value: FUNDING_STATUS_LABELS[submission.fundingStatus] },
                  ]}
                />
              </Section>

              <Section title={sections.collaboration}>
                <p className={styles.model}>{COLLABORATION_MODEL_LABELS[submission.collaborationModel]}</p>
                {submission.referral && (
                  <>
                    <p className={styles.notice}>{review.referralNotice(COMMISSION)}</p>
                    <DetailList
                      items={[
                        { label: fields.referralCompany, value: submission.referral.companyName },
                        { label: fields.referralContact, value: submission.referral.contactName },
                        { label: fields.referralEmail, value: submission.referral.contactEmail },
                        { label: fields.referralRelationship, value: submission.referral.relationship || messages.common.notSpecified },
                      ]}
                    />
                  </>
                )}
              </Section>

              <Section title={sections.consents}>
                <p className={styles.signature}>
                  <FileSignature />
                  {messages.agreements.signedBy(submission.agreement.signerName, formatDateTime(submission.agreement.signedAt))}
                  <span className={styles.muted}>{messages.agreements.version(submission.agreement.version)}</span>
                </p>
              </Section>

              {can(PERMISSIONS.SUBMISSIONS_REVIEW) && (
                <Section title={review.title}>
                  <SubmissionReview
                    submission={submission}
                    onConvert={() => onConvert(submission)}
                    onCreateOpportunity={() => onCreateOpportunity(submission)}
                  />
                </Section>
              )}
            </div>
          </>
        )}
      </SheetContent>
    </Sheet>
  )
}
