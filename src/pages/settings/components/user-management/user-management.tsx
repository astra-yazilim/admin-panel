import { SelectField } from '@/components/common/select-field/select-field'
import { UserAvatar } from '@/components/common/user-avatar/user-avatar'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { useAuth } from '@/hooks/use-auth'
import { useUpdateUserRole, useUsers } from '@/hooks/use-users'
import type { Role } from '@/types'
import { ROLE_LABELS } from '@/utils/validations/constants'
import { toOptions } from '@/utils/validations/helpers'
import { messages } from '@/utils/validations/messages'
import styles from './user-management.module.css'

const ROLE_OPTIONS = toOptions(ROLE_LABELS)

export function UserManagement() {
  const { user: currentUser } = useAuth()
  const { data: users = [] } = useUsers()
  const updateRole = useUpdateUserRole()

  return (
    <div className={styles.root}>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>{messages.settings.userColumn}</TableHead>
            <TableHead>{messages.settings.emailColumn}</TableHead>
            <TableHead>{messages.settings.roleColumn}</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {users.map((user) => (
            <TableRow key={user.id}>
              <TableCell>
                <span className={styles.user}>
                  <UserAvatar name={user.fullName} size="sm" />
                  <span className={styles.identity}>
                    <span className={styles.name}>{user.fullName}</span>
                    <span className={styles.muted}>{user.title}</span>
                  </span>
                </span>
              </TableCell>
              <TableCell className={styles.muted}>{user.email}</TableCell>
              <TableCell className={styles.roleCell}>
                <SelectField<Role>
                  value={user.role}
                  onValueChange={(role) => updateRole.mutate({ id: user.id, role })}
                  options={ROLE_OPTIONS}
                  disabled={user.id === currentUser?.id || updateRole.isPending}
                  aria-label={messages.settings.changeRole}
                />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}
