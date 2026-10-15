import { StarRating } from '@/components/common/star-rating/star-rating'
import { StatusBadge } from '@/components/common/status-badge/status-badge'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import type { Client, Project, Survey } from '@/types'
import { CLIENT_STATUS_CONFIG } from '@/utils/validations/constants'
import { average } from '@/utils/validations/helpers'
import { messages } from '@/utils/validations/messages'
import styles from './client-table.module.css'

interface ClientTableProps {
  clients: Client[]
  projects: Project[]
  surveys: Survey[]
  showContact: boolean
  onSelect: (client: Client) => void
}

const { columns } = messages.clients

export function ClientTable({ clients, projects, surveys, showContact, onSelect }: ClientTableProps) {
  return (
    <div className={styles.root}>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>{columns.company}</TableHead>
            {showContact && <TableHead>{columns.contact}</TableHead>}
            <TableHead>{columns.sector}</TableHead>
            <TableHead className={styles.numeric}>{columns.projects}</TableHead>
            <TableHead>{columns.satisfaction}</TableHead>
            <TableHead>{columns.status}</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {clients.map((client) => {
            const ratings = surveys
              .filter((survey) => survey.clientId === client.id && survey.status === 'completed')
              .map((survey) => survey.overallRating ?? 0)
            return (
              <TableRow key={client.id} className={styles.row} onClick={() => onSelect(client)}>
                <TableCell>
                  <span className={styles.stack}>
                    <span className={styles.company}>{client.companyName}</span>
                    <span className={styles.muted}>{client.website}</span>
                  </span>
                </TableCell>
                {showContact && (
                  <TableCell>
                    <span className={styles.stack}>
                      <span>{client.contactName}</span>
                      <span className={styles.muted}>{client.email}</span>
                    </span>
                  </TableCell>
                )}
                <TableCell className={styles.muted}>{client.sector || '—'}</TableCell>
                <TableCell className={styles.numeric}>
                  {projects.filter((project) => project.clientId === client.id).length}
                </TableCell>
                <TableCell>{ratings.length ? <StarRating value={average(ratings)} showValue /> : '—'}</TableCell>
                <TableCell>
                  <StatusBadge config={CLIENT_STATUS_CONFIG[client.status]} />
                </TableCell>
              </TableRow>
            )
          })}
        </TableBody>
      </Table>
    </div>
  )
}
