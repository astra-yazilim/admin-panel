import { NavLink, useLocation } from 'react-router-dom'
import { BrandLogo } from '@/components/common/brand-logo/brand-logo'
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
  useSidebar,
} from '@/components/ui/sidebar'
import { useAuth } from '@/hooks/use-auth'
import { findMenuItem, getMenuForPermissions } from '@/router/menu'
import { UserMenu } from '../user-menu/user-menu'
import styles from './app-sidebar.module.css'

export function AppSidebar() {
  const { can } = useAuth()
  const { pathname } = useLocation()
  const { state, isMobile, setOpenMobile } = useSidebar()
  const activeItem = findMenuItem(pathname)
  const groups = getMenuForPermissions(can)
  const isCollapsed = state === 'collapsed' && !isMobile

  return (
    <Sidebar collapsible="icon">
      <SidebarHeader className={styles.header}>
        <BrandLogo variant={isCollapsed ? 'icon' : 'full'} size="sm" />
      </SidebarHeader>
      <SidebarContent>
        {groups.map((group) => (
          <SidebarGroup key={group.title}>
            <SidebarGroupLabel>{group.title}</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {group.items.map((item) => (
                  <SidebarMenuItem key={item.path}>
                    <SidebarMenuButton asChild isActive={activeItem?.path === item.path} tooltip={item.title}>
                      <NavLink to={item.path} onClick={() => setOpenMobile(false)}>
                        <item.icon />
                        <span>{item.title}</span>
                      </NavLink>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        ))}
      </SidebarContent>
      <SidebarFooter>
        <UserMenu />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}
