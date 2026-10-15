import { StatusBadge } from '@/components/common/status-badge/status-badge'
import { UserAvatar } from '@/components/common/user-avatar/user-avatar'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { useAuth } from '@/hooks/use-auth'
import { useTheme } from '@/hooks/use-theme'
import { useUiStore } from '@/store/ui.store'
import { ROLE_DESCRIPTIONS, ROLE_LABELS } from '@/utils/validations/constants'
import { messages } from '@/utils/validations/messages'
import styles from './preferences-panel.module.css'

const { settings } = messages

export function PreferencesPanel() {
  const { user } = useAuth()
  const { theme, setTheme } = useTheme()
  const isSidebarOpen = useUiStore((state) => state.isSidebarOpen)
  const setSidebarOpen = useUiStore((state) => state.setSidebarOpen)
  if (!user) return null

  return (
    <div className={styles.root}>
      <Card>
        <CardHeader>
          <CardTitle>{settings.profile}</CardTitle>
        </CardHeader>
        <CardContent className={styles.profile}>
          <UserAvatar name={user.fullName} imageUrl={user.avatarUrl} size="lg" />
          <div className={styles.identity}>
            <span className={styles.name}>{user.fullName}</span>
            <span className={styles.muted}>{user.title}</span>
            <span className={styles.muted}>{user.email}</span>
            <StatusBadge label={ROLE_LABELS[user.role]} tone="primary" className={styles.role} />
            <p className={styles.muted}>{ROLE_DESCRIPTIONS[user.role]}</p>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>{settings.appearance}</CardTitle>
        </CardHeader>
        <CardContent className={styles.options}>
          <div className={styles.option}>
            <div className={styles.optionText}>
              <Label htmlFor="dark-mode">{settings.darkMode}</Label>
              <span className={styles.muted}>{settings.darkModeDescription}</span>
            </div>
            <Switch
              id="dark-mode"
              checked={theme === 'dark'}
              onCheckedChange={(checked) => setTheme(checked ? 'dark' : 'light')}
            />
          </div>
          <div className={styles.option}>
            <div className={styles.optionText}>
              <Label htmlFor="compact-sidebar">{settings.compactSidebar}</Label>
              <span className={styles.muted}>{settings.compactSidebarDescription}</span>
            </div>
            <Switch
              id="compact-sidebar"
              checked={!isSidebarOpen}
              onCheckedChange={(checked) => setSidebarOpen(!checked)}
            />
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
