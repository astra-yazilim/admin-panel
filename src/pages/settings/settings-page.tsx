import { PageHeader } from '@/components/common/page-header/page-header'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { useAuth } from '@/hooks/use-auth'
import { PERMISSIONS } from '@/types'
import { messages } from '@/utils/validations/messages'
import { PreferencesPanel } from './components/preferences-panel/preferences-panel'
import { RoleMatrix } from './components/role-matrix/role-matrix'
import { SystemConstants } from './components/system-constants/system-constants'
import { UserManagement } from './components/user-management/user-management'
import styles from './settings-page.module.css'

const { tabs } = messages.settings

export default function SettingsPage() {
  const { can } = useAuth()
  const canManage = can(PERMISSIONS.SETTINGS_MANAGE)

  return (
    <>
      <PageHeader title={messages.settings.title} description={messages.settings.description} />
      <Tabs defaultValue="preferences" className={styles.tabs}>
        <TabsList className={styles.list}>
          <TabsTrigger value="preferences">{tabs.preferences}</TabsTrigger>
          {canManage && <TabsTrigger value="roles">{tabs.roles}</TabsTrigger>}
          {canManage && <TabsTrigger value="users">{tabs.users}</TabsTrigger>}
          {canManage && <TabsTrigger value="system">{tabs.system}</TabsTrigger>}
        </TabsList>
        <TabsContent value="preferences">
          <PreferencesPanel />
        </TabsContent>
        {canManage && (
          <>
            <TabsContent value="roles">
              <RoleMatrix />
            </TabsContent>
            <TabsContent value="users">
              <UserManagement />
            </TabsContent>
            <TabsContent value="system">
              <SystemConstants />
            </TabsContent>
          </>
        )}
      </Tabs>
    </>
  )
}
