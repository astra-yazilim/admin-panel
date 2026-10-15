import { UserPlus } from 'lucide-react'
import { useMemo, useState } from 'react'
import { EmptyState } from '@/components/common/empty-state/empty-state'
import { FilterTabs } from '@/components/common/filter-tabs/filter-tabs'
import { StatusBadge } from '@/components/common/status-badge/status-badge'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { useApplications } from '@/hooks/use-developers'
import type { ApplicationStatus } from '@/types'
import {
  ALL_FILTER_VALUE,
  APPLICATION_STATUS_CONFIG,
  APPLICATION_STATUS_ORDER,
  EXPERIENCE_LABELS,
  EXPERTISE_LABELS,
} from '@/utils/validations/constants'
import { formatRelativeDate } from '@/utils/validations/formatters'
import { buildFilterTabs, countBy } from '@/utils/validations/helpers'
import { messages } from '@/utils/validations/messages'
import { ApplicationDetailSheet } from '../application-detail-sheet/application-detail-sheet'
import styles from './application-pipeline.module.css'

type StatusFilter = ApplicationStatus | typeof ALL_FILTER_VALUE

const MAX_VISIBLE_EXPERTISE = 2
const { columns } = messages.developers

export function ApplicationPipeline() {
  const { data: applications = [] } = useApplications()
  const [status, setStatus] = useState<StatusFilter>(ALL_FILTER_VALUE)
  const [selectedId, setSelectedId] = useState<string>()

  const tabs = useMemo(
    () =>
      buildFilterTabs(
        messages.common.all,
        APPLICATION_STATUS_ORDER,
        APPLICATION_STATUS_CONFIG,
        countBy(applications, (application) => application.status),
      ),
    [applications],
  )

  const filtered = applications
    .filter((application) => status === ALL_FILTER_VALUE || application.status === status)
    .sort((a, b) => b.createdAt.localeCompare(a.createdAt))

  return (
    <div className={styles.root}>
      <FilterTabs<StatusFilter> tabs={tabs} value={status} onChange={setStatus} />
      {filtered.length === 0 ? (
        <EmptyState icon={UserPlus} title={messages.developers.applicationsEmpty} />
      ) : (
        <div className={styles.table}>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>{columns.applicant}</TableHead>
                <TableHead>{columns.title}</TableHead>
                <TableHead>{columns.experience}</TableHead>
                <TableHead>{columns.expertise}</TableHead>
                <TableHead>{columns.status}</TableHead>
                <TableHead className={styles.date}>{columns.createdAt}</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map((application) => (
                <TableRow key={application.id} className={styles.row} onClick={() => setSelectedId(application.id)}>
                  <TableCell>
                    <span className={styles.applicant}>
                      <span className={styles.name}>{application.fullName}</span>
                      <span className={styles.muted}>{application.city}</span>
                    </span>
                  </TableCell>
                  <TableCell>{application.title}</TableCell>
                  <TableCell>{EXPERIENCE_LABELS[application.experience]}</TableCell>
                  <TableCell>
                    <span className={styles.expertise}>
                      {application.expertiseAreas.slice(0, MAX_VISIBLE_EXPERTISE).map((area) => (
                        <StatusBadge key={area} label={EXPERTISE_LABELS[area]} />
                      ))}
                      {application.expertiseAreas.length > MAX_VISIBLE_EXPERTISE && (
                        <span className={styles.muted}>+{application.expertiseAreas.length - MAX_VISIBLE_EXPERTISE}</span>
                      )}
                    </span>
                  </TableCell>
                  <TableCell>
                    <StatusBadge config={APPLICATION_STATUS_CONFIG[application.status]} />
                  </TableCell>
                  <TableCell className={styles.date}>{formatRelativeDate(application.createdAt)}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}
      <ApplicationDetailSheet
        application={applications.find((application) => application.id === selectedId)}
        onOpenChange={(open) => !open && setSelectedId(undefined)}
      />
    </div>
  )
}
