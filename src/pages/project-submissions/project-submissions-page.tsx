import { ExternalLink, Lightbulb } from 'lucide-react'
import { useMemo, useState } from 'react'
import { EmptyState } from '@/components/common/empty-state/empty-state'
import { FilterTabs } from '@/components/common/filter-tabs/filter-tabs'
import { PageHeader } from '@/components/common/page-header/page-header'
import { PageLoader } from '@/components/common/page-loader/page-loader'
import { SearchInput } from '@/components/common/search-input/search-input'
import { Button } from '@/components/ui/button'
import { useProjectSubmissions } from '@/hooks/use-project-submissions'
import { OpportunityFormSheet } from '@/pages/investors/components/opportunity-form-sheet/opportunity-form-sheet'
import { ProjectFormSheet } from '@/pages/projects/components/project-form-sheet/project-form-sheet'
import type { ProjectSubmission, SubmissionStatus } from '@/types'
import {
  ALL_FILTER_VALUE,
  LANDING_LINKS,
  SUBMISSION_STATUS_CONFIG,
  SUBMISSION_STATUS_ORDER,
} from '@/utils/validations/constants'
import { buildFilterTabs, countBy, matchesSearch } from '@/utils/validations/helpers'
import { messages } from '@/utils/validations/messages'
import { SubmissionDetailSheet } from './components/submission-detail-sheet/submission-detail-sheet'
import { SubmissionTable } from './components/submission-table/submission-table'
import styles from './project-submissions-page.module.css'

type StatusFilter = SubmissionStatus | typeof ALL_FILTER_VALUE

export default function ProjectSubmissionsPage() {
  const { data: submissions = [], isLoading } = useProjectSubmissions()
  const [status, setStatus] = useState<StatusFilter>(ALL_FILTER_VALUE)
  const [search, setSearch] = useState('')
  const [selectedId, setSelectedId] = useState<string>()
  const [convertingSubmission, setConvertingSubmission] = useState<ProjectSubmission>()
  const [opportunitySubmission, setOpportunitySubmission] = useState<ProjectSubmission>()

  const tabs = useMemo(
    () =>
      buildFilterTabs(messages.common.all, SUBMISSION_STATUS_ORDER, SUBMISSION_STATUS_CONFIG, countBy(submissions, (item) => item.status)),
    [submissions],
  )

  const filtered = submissions
    .filter((submission) => status === ALL_FILTER_VALUE || submission.status === status)
    .filter((submission) => matchesSearch(search, submission.projectName, submission.fullName, submission.companyName))
    .sort((a, b) => b.createdAt.localeCompare(a.createdAt))

  const startConversion = (submission: ProjectSubmission) => {
    setSelectedId(undefined)
    setConvertingSubmission(submission)
  }

  const startOpportunity = (submission: ProjectSubmission) => {
    setSelectedId(undefined)
    setOpportunitySubmission(submission)
  }

  return (
    <>
      <PageHeader
        title={messages.submissions.title}
        description={messages.submissions.description}
        actions={
          <Button asChild variant="outline">
            <a href={LANDING_LINKS.projectApplication} target="_blank" rel="noreferrer">
              <ExternalLink />
              {messages.submissions.publicFormLink}
            </a>
          </Button>
        }
      />
      <div className={styles.toolbar}>
        <FilterTabs<StatusFilter> tabs={tabs} value={status} onChange={setStatus} />
        <SearchInput value={search} onChange={setSearch} placeholder={messages.submissions.searchPlaceholder} />
      </div>
      {isLoading ? (
        <PageLoader />
      ) : filtered.length === 0 ? (
        <EmptyState icon={Lightbulb} title={messages.submissions.empty} />
      ) : (
        <SubmissionTable submissions={filtered} onSelect={(submission) => setSelectedId(submission.id)} />
      )}
      <SubmissionDetailSheet
        submission={submissions.find((submission) => submission.id === selectedId)}
        onOpenChange={(open) => !open && setSelectedId(undefined)}
        onConvert={startConversion}
        onCreateOpportunity={startOpportunity}
      />
      <ProjectFormSheet
        open={Boolean(convertingSubmission)}
        submission={convertingSubmission}
        onOpenChange={(open) => !open && setConvertingSubmission(undefined)}
      />
      <OpportunityFormSheet
        open={Boolean(opportunitySubmission)}
        submission={opportunitySubmission}
        onOpenChange={(open) => !open && setOpportunitySubmission(undefined)}
      />
    </>
  )
}
