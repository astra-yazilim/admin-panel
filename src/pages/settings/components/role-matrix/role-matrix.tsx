import { Check, Minus } from 'lucide-react'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { PERMISSIONS, ROLES } from '@/types'
import { PERMISSION_LABELS, ROLE_LABELS } from '@/utils/validations/constants'
import { hasPermission } from '@/utils/validations/helpers'
import { messages } from '@/utils/validations/messages'
import styles from './role-matrix.module.css'

const ROLE_LIST = Object.values(ROLES)
const PERMISSION_LIST = Object.values(PERMISSIONS)

export function RoleMatrix() {
  return (
    <div className={styles.root}>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>{messages.settings.permission}</TableHead>
            {ROLE_LIST.map((role) => (
              <TableHead key={role} className={styles.role}>
                {ROLE_LABELS[role]}
              </TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {PERMISSION_LIST.map((permission) => (
            <TableRow key={permission}>
              <TableCell>
                <span className={styles.permission}>
                  {PERMISSION_LABELS[permission]}
                  <code className={styles.key}>{permission}</code>
                </span>
              </TableCell>
              {ROLE_LIST.map((role) => (
                <TableCell key={role} className={styles.cell}>
                  {hasPermission(role, permission) ? (
                    <Check className={styles.granted} aria-label={messages.common.yes} />
                  ) : (
                    <Minus className={styles.denied} aria-label={messages.common.no} />
                  )}
                </TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}
