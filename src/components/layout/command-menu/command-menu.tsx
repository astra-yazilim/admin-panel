import { FolderKanban } from 'lucide-react'
import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from '@/components/ui/command'
import { useAuth } from '@/hooks/use-auth'
import { useProjects } from '@/hooks/use-projects'
import { getMenuForPermissions } from '@/router/menu'
import { useUiStore } from '@/store/ui.store'
import { PERMISSIONS } from '@/types'
import { ROUTE_PATHS } from '@/utils/validations/constants'
import { buildPath } from '@/utils/validations/formatters'
import { messages } from '@/utils/validations/messages'

const SHORTCUT_KEY = 'k'

export function CommandMenu() {
  const navigate = useNavigate()
  const { can } = useAuth()
  const isOpen = useUiStore((state) => state.isCommandMenuOpen)
  const setOpen = useUiStore((state) => state.setCommandMenuOpen)
  const { data: projects = [] } = useProjects()
  const canViewProjects = can(PERMISSIONS.PROJECTS_VIEW)

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === SHORTCUT_KEY && (event.metaKey || event.ctrlKey)) {
        event.preventDefault()
        setOpen(!useUiStore.getState().isCommandMenuOpen)
      }
    }
    document.addEventListener('keydown', onKeyDown)
    return () => document.removeEventListener('keydown', onKeyDown)
  }, [setOpen])

  const goTo = (path: string) => {
    setOpen(false)
    navigate(path)
  }

  return (
    <CommandDialog open={isOpen} onOpenChange={setOpen}>
      <CommandInput placeholder={messages.navigation.commandPlaceholder} />
      <CommandList>
        <CommandEmpty>{messages.common.noResults}</CommandEmpty>
        <CommandGroup heading={messages.navigation.commandPages}>
          {getMenuForPermissions(can)
            .flatMap((group) => group.items)
            .map((item) => (
              <CommandItem key={item.path} onSelect={() => goTo(item.path)}>
                <item.icon />
                {item.title}
              </CommandItem>
            ))}
        </CommandGroup>
        {canViewProjects && projects.length > 0 && (
          <>
            <CommandSeparator />
            <CommandGroup heading={messages.navigation.commandProjects}>
              {projects.map((project) => (
                <CommandItem
                  key={project.id}
                  value={`${project.code} ${project.title}`}
                  onSelect={() => goTo(buildPath(ROUTE_PATHS.projectDetail, { projectId: project.id }))}
                >
                  <FolderKanban />
                  <span>{project.code}</span>
                  <span>{project.title}</span>
                </CommandItem>
              ))}
            </CommandGroup>
          </>
        )}
      </CommandList>
    </CommandDialog>
  )
}
