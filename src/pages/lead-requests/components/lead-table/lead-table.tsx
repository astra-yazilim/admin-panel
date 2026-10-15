import { StatusBadge } from '@/components/common/status-badge/status-badge'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import type { Lead } from '@/types'
import { LEAD_STATUS_CONFIG, SERVICE_LABELS } from '@/utils/validations/constants'
import { formatDate, formatRelativeDate } from '@/utils/validations/formatters'
import { messages } from '@/utils/validations/messages'
import styles from './lead-table.module.css'

interface LeadTableProps {
  leads: Lead[]
  onSelect: (lead: Lead) => void
}

const { columns } = messages.leads

export function LeadTable({ leads, onSelect }: LeadTableProps) {
  return (
    <div className={styles.root}>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>{columns.contact}</TableHead>
            <TableHead>{columns.company}</TableHead>
            <TableHead>{columns.service}</TableHead>
            <TableHead>{columns.status}</TableHead>
            <TableHead className={styles.date}>{columns.createdAt}</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {leads.map((lead) => (
            <TableRow key={lead.id} className={styles.row} onClick={() => onSelect(lead)}>
              <TableCell>
                <span className={styles.contact}>
                  <span className={styles.name}>{lead.fullName}</span>
                  <span className={styles.muted}>{lead.email}</span>
                </span>
              </TableCell>
              <TableCell>{lead.companyName || '—'}</TableCell>
              <TableCell className={styles.service}>{SERVICE_LABELS[lead.service]}</TableCell>
              <TableCell>
                <StatusBadge config={LEAD_STATUS_CONFIG[lead.status]} />
              </TableCell>
              <TableCell className={styles.date} title={formatDate(lead.createdAt)}>
                {formatRelativeDate(lead.createdAt)}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}
