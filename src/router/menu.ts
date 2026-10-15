import {
  BadgeCheck,
  Briefcase,
  Building2,
  Gem,
  Inbox,
  Lightbulb,
  KanbanSquare,
  LayoutDashboard,
  Settings,
  Wallet,
  type LucideIcon,
} from 'lucide-react'
import { PERMISSIONS, type Permission } from '@/types'
import { ROUTE_PATHS } from '@/utils/validations/constants'
import { messages } from '@/utils/validations/messages'

export interface MenuItem {
  title: string
  path: string
  icon: LucideIcon
  permission: Permission
}

export interface MenuGroup {
  title: string
  items: MenuItem[]
}

const { navigation } = messages

export const MENU_GROUPS: MenuGroup[] = [
  {
    title: navigation.groups.dashboard,
    items: [
      {
        title: navigation.dashboard,
        path: ROUTE_PATHS.dashboard,
        icon: LayoutDashboard,
        permission: PERMISSIONS.DASHBOARD_VIEW,
      },
    ],
  },
  {
    title: navigation.groups.pipeline,
    items: [
      { title: navigation.leadRequests, path: ROUTE_PATHS.leadRequests, icon: Inbox, permission: PERMISSIONS.LEADS_VIEW },
      {
        title: navigation.projectSubmissions,
        path: ROUTE_PATHS.projectSubmissions,
        icon: Lightbulb,
        permission: PERMISSIONS.SUBMISSIONS_VIEW,
      },
    ],
  },
  {
    title: navigation.groups.workflows,
    items: [
      { title: navigation.projects, path: ROUTE_PATHS.projects, icon: KanbanSquare, permission: PERMISSIONS.PROJECTS_VIEW },
    ],
  },
  {
    title: navigation.groups.network,
    items: [
      {
        title: navigation.verifiedDevelopers,
        path: ROUTE_PATHS.verifiedDevelopers,
        icon: BadgeCheck,
        permission: PERMISSIONS.DEVELOPERS_VIEW,
      },
      { title: navigation.clients, path: ROUTE_PATHS.clients, icon: Building2, permission: PERMISSIONS.CLIENTS_VIEW },
    ],
  },
  {
    title: navigation.groups.investment,
    items: [
      { title: navigation.investors, path: ROUTE_PATHS.investors, icon: Briefcase, permission: PERMISSIONS.INVESTORS_VIEW },
      {
        title: navigation.opportunities,
        path: ROUTE_PATHS.opportunities,
        icon: Gem,
        permission: PERMISSIONS.OPPORTUNITIES_BROWSE,
      },
    ],
  },
  {
    title: navigation.groups.finance,
    items: [{ title: navigation.finance, path: ROUTE_PATHS.finance, icon: Wallet, permission: PERMISSIONS.FINANCE_VIEW }],
  },
  {
    title: navigation.groups.settings,
    items: [
      { title: navigation.settings, path: ROUTE_PATHS.settings, icon: Settings, permission: PERMISSIONS.SETTINGS_VIEW },
    ],
  },
]

export const getMenuForPermissions = (can: (permission: Permission) => boolean) =>
  MENU_GROUPS.map((group) => ({ ...group, items: group.items.filter((item) => can(item.permission)) })).filter(
    (group) => group.items.length > 0,
  )

export const findMenuItem = (pathname: string) =>
  MENU_GROUPS.flatMap((group) => group.items)
    .filter((item) => (item.path === ROUTE_PATHS.dashboard ? pathname === item.path : pathname.startsWith(item.path)))
    .at(0)
