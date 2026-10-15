import { CalendarDays, MoreHorizontal } from 'lucide-react'
import type { DragEvent } from 'react'
import { AvatarGroup } from '@/components/common/avatar-group/avatar-group'
import { StatusBadge } from '@/components/common/status-badge/status-badge'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Progress } from '@/components/ui/progress'
import { cn } from '@/lib/utils'
import type { Project, ProjectStatus } from '@/types'
import {
  OWNER_TYPE_CONFIG,
  PRIORITY_CONFIG,
  PROJECT_CATEGORY_LABELS,
  PROJECT_STATUS_CONFIG,
  PROJECT_STATUS_ORDER,
} from '@/utils/validations/constants'
import { formatDate } from '@/utils/validations/formatters'
import { daysUntil } from '@/utils/validations/helpers'
import { messages } from '@/utils/validations/messages'
import styles from './project-card.module.css'

interface ProjectCardProps {
  project: Project
  clientName?: string
  assigneeNames: string[]
  isDragging: boolean
  canMove: boolean
  dragProps: {
    draggable: boolean
    onDragStart: (event: DragEvent<HTMLElement>) => void
    onDragEnd: () => void
  }
  onOpen: () => void
  onMove: (status: ProjectStatus) => void
}

export function ProjectCard({
  project,
  clientName,
  assigneeNames,
  isDragging,
  canMove,
  dragProps,
  onOpen,
  onMove,
}: ProjectCardProps) {
  const isOverdue = project.status !== 'live' && daysUntil(project.dueDate) < 0

  return (
    <article {...dragProps} className={cn(styles.root, isDragging && styles.dragging, canMove && styles.movable)}>
      <div className={styles.header}>
        <span className={styles.code}>{project.code}</span>
        <StatusBadge config={PRIORITY_CONFIG[project.priority]} />
        {canMove && (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className={styles.menu} aria-label={messages.projects.moveTo}>
                <MoreHorizontal />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>{messages.projects.moveTo}</DropdownMenuLabel>
              <DropdownMenuRadioGroup value={project.status} onValueChange={(value) => onMove(value as ProjectStatus)}>
                {PROJECT_STATUS_ORDER.map((status) => (
                  <DropdownMenuRadioItem key={status} value={status}>
                    {PROJECT_STATUS_CONFIG[status].label}
                  </DropdownMenuRadioItem>
                ))}
              </DropdownMenuRadioGroup>
            </DropdownMenuContent>
          </DropdownMenu>
        )}
      </div>

      <button type="button" className={styles.title} onClick={onOpen}>
        {project.title}
      </button>
      {clientName && <p className={styles.client}>{clientName}</p>}

      <div className={styles.tags}>
        <StatusBadge config={OWNER_TYPE_CONFIG[project.ownerType]} />
        <span className={styles.category}>{PROJECT_CATEGORY_LABELS[project.category]}</span>
      </div>

      <Progress value={project.progress} className={styles.progress} aria-label={messages.projects.progress} />

      <div className={styles.footer}>
        <AvatarGroup names={assigneeNames} />
        <span className={cn(styles.due, isOverdue && styles.overdue)}>
          <CalendarDays />
          {formatDate(project.dueDate)}
        </span>
      </div>
    </article>
  )
}
