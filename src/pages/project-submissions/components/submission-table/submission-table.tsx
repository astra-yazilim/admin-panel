import { StatusBadge } from '@/components/common/status-badge/status-badge'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import type { ProjectSubmission } from '@/types'
import {
  COLLABORATION_MODEL_LABELS,
  PROJECT_BUDGET_LABELS,
  SUBMISSION_STAGE_LABELS,
  SUBMISSION_STATUS_CONFIG,
} from '@/utils/validations/constants'
import { formatRelativeDate } from '@/utils/validations/formatters'
import { messages } from '@/utils/validations/messages'
import styles from './submission-table.module.css'

interface SubmissionTableProps {
  submissions: ProjectSubmission[]
  onSelect: (submission: ProjectSubmission) => void
}

const { columns } = messages.submissions

export function SubmissionTable({ submissions, onSelect }: SubmissionTableProps) {
  return (
    <div className={styles.root}>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>{columns.project}</TableHead>
            <TableHead>{columns.applicant}</TableHead>
            <TableHead>{columns.stage}</TableHead>
            <TableHead>{columns.model}</TableHead>
            <TableHead>{columns.budget}</TableHead>
            <TableHead>{columns.status}</TableHead>
            <TableHead className={styles.date}>{columns.createdAt}</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {submissions.map((submission) => (
            <TableRow key={submission.id} className={styles.row} onClick={() => onSelect(submission)}>
              <TableCell>
                <span className={styles.stack}>
                  <span className={styles.code}>{submission.code}</span>
                  <span className={styles.name}>{submission.projectName}</span>
                </span>
              </TableCell>
              <TableCell>
                <span className={styles.stack}>
                  <span>{submission.fullName}</span>
                  <span className={styles.muted}>{submission.companyName || submission.role}</span>
                </span>
              </TableCell>
              <TableCell>{SUBMISSION_STAGE_LABELS[submission.stage]}</TableCell>
              <TableCell>{COLLABORATION_MODEL_LABELS[submission.collaborationModel]}</TableCell>
              <TableCell className={styles.budget}>{PROJECT_BUDGET_LABELS[submission.budgetRange]}</TableCell>
              <TableCell>
                <StatusBadge config={SUBMISSION_STATUS_CONFIG[submission.status]} />
              </TableCell>
              <TableCell className={styles.date}>{formatRelativeDate(submission.createdAt)}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}
