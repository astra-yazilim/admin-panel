import { Search } from 'lucide-react'
import { useLocation } from 'react-router-dom'
import { ThemeToggle } from '@/components/common/theme-toggle/theme-toggle'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { SidebarTrigger } from '@/components/ui/sidebar'
import { findMenuItem } from '@/router/menu'
import { useUiStore } from '@/store/ui.store'
import { messages } from '@/utils/validations/messages'
import styles from './app-header.module.css'

export function AppHeader() {
  const { pathname } = useLocation()
  const setCommandMenuOpen = useUiStore((state) => state.setCommandMenuOpen)
  const currentItem = findMenuItem(pathname)

  return (
    <header className={styles.root}>
      <SidebarTrigger />
      <Separator orientation="vertical" className={styles.separator} />
      <span className={styles.title}>{currentItem?.title}</span>
      <div className={styles.actions}>
        <Button variant="outline" className={styles.search} onClick={() => setCommandMenuOpen(true)}>
          <Search />
          <span className={styles.searchLabel}>{messages.navigation.commandPlaceholder}</span>
          <kbd className={styles.shortcut}>{messages.navigation.commandShortcut}</kbd>
        </Button>
        <ThemeToggle />
      </div>
    </header>
  )
}
