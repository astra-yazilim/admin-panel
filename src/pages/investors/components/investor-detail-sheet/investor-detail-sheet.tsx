import { BadgeCheck, CheckCircle2, ExternalLink, FileSignature, XCircle } from 'lucide-react'
import type { ReactNode } from 'react'
import { DetailList } from '@/components/common/detail-list/detail-list'
import { StatusBadge } from '@/components/common/status-badge/status-badge'
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from '@/components/ui/sheet'
import { useAuth } from '@/hooks/use-auth'
import { getEmailDomain } from '@/schemas/schema-helpers'
import { PERMISSIONS, type Investor } from '@/types'
import {
  ACCESS_METHOD_LABELS,
  EMPLOYEE_COUNT_LABELS,
  INVESTMENT_BUDGET_LABELS,
  INVESTMENT_HORIZON_LABELS,
  INVESTMENT_STAGE_LABELS,
  INVESTOR_STATUS_CONFIG,
  INVESTOR_TYPE_LABELS,
  INVOLVEMENT_LABELS,
  PREVIOUS_INVESTMENTS_LABELS,
  SECTOR_LABELS,
} from '@/utils/validations/constants'
import { formatDateTime, stripProtocol, toExternalUrl } from '@/utils/validations/formatters'
import { messages } from '@/utils/validations/messages'
import { InvestorReview } from '../investor-review/investor-review'
import styles from './investor-detail-sheet.module.css'

const { fields, sections } = messages.applications.investor
const { verification } = messages.investors
const WWW_PREFIX = /^www\./

function Section({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section className={styles.section}>
      <h3 className={styles.heading}>{title}</h3>
      {children}
    </section>
  )
}

function Check({ ok, label }: { ok: boolean; label: string }) {
  return (
    <li className={ok ? styles.ok : styles.warn}>
      {ok ? <CheckCircle2 /> : <XCircle />}
      {label}
    </li>
  )
}

interface InvestorDetailSheetProps {
  investor: Investor | undefined
  onOpenChange: (open: boolean) => void
}

export function InvestorDetailSheet({ investor, onOpenChange }: InvestorDetailSheetProps) {
  const { can } = useAuth()
  const domain = investor ? getEmailDomain(investor.corporateEmail) : ''
  const websiteDomain = investor ? stripProtocol(investor.companyWebsite).replace(WWW_PREFIX, '') : ''
  const domainMatches = Boolean(websiteDomain) && domain === websiteDomain

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
    <Sheet open={Boolean(investor)} onOpenChange={onOpenChange}>
      <SheetContent className={styles.content}>
        {investor && (
          <>
            <SheetHeader className={styles.header}>
              <StatusBadge config={INVESTOR_STATUS_CONFIG[investor.status]} className={styles.badge} />
              <SheetTitle>{investor.fullName}</SheetTitle>
              <SheetDescription>
                {investor.title} · {investor.companyName}
              </SheetDescription>
            </SheetHeader>
            <div className={styles.body}>
              <Section title={verification.title}>
                <ul className={styles.checks}>
                  <Check ok label={`${verification.corporateEmail}: ${domain}`} />
                  <Check ok={domainMatches} label={domainMatches ? verification.domainMatch : verification.domainMismatch} />
                  <Check ok={investor.hasInvestorLicense} label={fields.hasInvestorLicense} />
                </ul>
              </Section>

              <Section title={sections.personal}>
                <DetailList
                  items={[
                    { label: fields.corporateEmail, value: investor.corporateEmail },
                    { label: fields.phone, value: investor.phone },
                    { label: fields.city, value: investor.city || messages.common.notSpecified },
                    { label: fields.profession, value: investor.profession },
                    { label: fields.linkedinUrl, value: link(investor.linkedinUrl) },
                    { label: fields.referralSource, value: investor.referralSource || messages.common.notSpecified },
                  ]}
                />
              </Section>

              <Section title={sections.company}>
                <DetailList
                  items={[
                    { label: fields.companyName, value: investor.companyName },
                    { label: fields.companyWebsite, value: link(investor.companyWebsite) },
                    { label: fields.sector, value: SECTOR_LABELS[investor.sector] },
                    { label: fields.employeeCount, value: EMPLOYEE_COUNT_LABELS[investor.employeeCount] },
                  ]}
                />
              </Section>

              <Section title={sections.profile}>
                <DetailList
                  items={[
                    { label: fields.investorType, value: INVESTOR_TYPE_LABELS[investor.investorType] },
                    { label: fields.budgetRange, value: INVESTMENT_BUDGET_LABELS[investor.budgetRange] },
                    { label: fields.horizon, value: INVESTMENT_HORIZON_LABELS[investor.horizon] },
                    { label: fields.previousInvestments, value: PREVIOUS_INVESTMENTS_LABELS[investor.previousInvestments] },
                    { label: fields.involvement, value: INVOLVEMENT_LABELS[investor.involvement] },
                  ]}
                />
                <div className={styles.chips}>
                  {investor.preferredStages.map((stage) => (
                    <StatusBadge key={stage} label={INVESTMENT_STAGE_LABELS[stage]} tone="gold" />
                  ))}
                  {investor.interestAreas.map((area) => (
                    <StatusBadge key={area} label={SECTOR_LABELS[area]} tone="primary" />
                  ))}
                </div>
                {investor.note && <p className={styles.note}>{investor.note}</p>}
              </Section>

              <Section title={sections.consents}>
                <p className={styles.signature}>
                  <FileSignature />
                  {messages.agreements.signedBy(investor.agreement.signerName, formatDateTime(investor.agreement.signedAt))}
                  <span className={styles.muted}>{messages.agreements.version(investor.agreement.version)}</span>
                </p>
                {investor.access && (
                  <p className={styles.signature}>
                    <BadgeCheck />
                    {messages.investors.access.granted(formatDateTime(investor.access.issuedAt))}
                    <span className={styles.muted}>{ACCESS_METHOD_LABELS[investor.access.method]}</span>
                  </p>
                )}
              </Section>

              {can(PERMISSIONS.INVESTORS_APPROVE) && investor.status !== 'rejected' && (
                <Section title={messages.investors.review.title}>
                  <InvestorReview investor={investor} />
                </Section>
              )}
            </div>
          </>
        )}
      </SheetContent>
    </Sheet>
  )
}
