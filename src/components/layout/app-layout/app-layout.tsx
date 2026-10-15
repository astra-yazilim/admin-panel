import { Suspense } from 'react'
import { Outlet } from 'react-router-dom'
import { PageLoader } from '@/components/common/page-loader/page-loader'
import { SidebarInset, SidebarProvider } from '@/components/ui/sidebar'
import { useUiStore } from '@/store/ui.store'
import { AppHeader } from '../app-header/app-header'
import { AppSidebar } from '../app-sidebar/app-sidebar'
import { CommandMenu } from '../command-menu/command-menu'
import styles from './app-layout.module.css'

export function AppLayout() {
  const isSidebarOpen = useUiStore((state) => state.isSidebarOpen)
  const setSidebarOpen = useUiStore((state) => state.setSidebarOpen)

  return (
    <SidebarProvider open={isSidebarOpen} onOpenChange={setSidebarOpen}>
      <AppSidebar />
      <SidebarInset className={styles.inset}>
        <AppHeader />
        <main className={styles.main}>
          <Suspense fallback={<PageLoader />}>
            <Outlet />
          </Suspense>
        </main>
      </SidebarInset>
      <CommandMenu />
    </SidebarProvider>
  )
}
