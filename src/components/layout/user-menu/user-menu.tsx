import { ChevronsUpDown, LogOut, Settings } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { UserAvatar } from '@/components/common/user-avatar/user-avatar'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { SidebarMenu, SidebarMenuButton, SidebarMenuItem } from '@/components/ui/sidebar'
import { useAuth } from '@/hooks/use-auth'
import { ROLE_LABELS, ROUTE_PATHS } from '@/utils/validations/constants'
import { messages } from '@/utils/validations/messages'
import styles from './user-menu.module.css'

export function UserMenu() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  if (!user) return null

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton size="lg" className={styles.trigger}>
              <UserAvatar name={user.fullName} imageUrl={user.avatarUrl} size="sm" />
              <span className={styles.identity}>
                <span className={styles.name}>{user.fullName}</span>
                <span className={styles.role}>{ROLE_LABELS[user.role]}</span>
              </span>
              <ChevronsUpDown className={styles.chevron} />
            </SidebarMenuButton>
          </DropdownMenuTrigger>
          <DropdownMenuContent side="top" align="start" className={styles.content}>
            <DropdownMenuLabel className={styles.label}>
              <span className={styles.name}>{user.fullName}</span>
              <span className={styles.email}>{user.email}</span>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem onSelect={() => navigate(ROUTE_PATHS.settings)}>
              <Settings />
              {messages.navigation.profile}
            </DropdownMenuItem>
            <DropdownMenuItem variant="destructive" onSelect={logout}>
              <LogOut />
              {messages.navigation.logout}
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  )
}
