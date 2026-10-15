import { StatusBadge } from '@/components/common/status-badge/status-badge'
import { useKanban } from '@/hooks/use-kanban'
import { cn } from '@/lib/utils'
import type { Client, Developer, Project, ProjectStatus } from '@/types'
import { PROJECT_STATUS_CONFIG } from '@/utils/validations/constants'
import { messages } from '@/utils/validations/messages'
import { ProjectCard } from '../project-card/project-card'
import styles from './kanban-board.module.css'

interface KanbanBoardProps {
  projects: Project[]
  clients: Map<string, Client>
  developers: Map<string, Developer>
  canMove: boolean
  onMove: (projectId: string, status: ProjectStatus) => void
  onOpen: (project: Project) => void
}

export function KanbanBoard({ projects, clients, developers, canMove, onMove, onOpen }: KanbanBoardProps) {
  const { columns, draggedId, overStatus, getCardProps, getColumnProps } = useKanban({
    projects,
    isDragEnabled: canMove,
    onMove,
  })

  return (
    <div className={styles.root}>
      {columns.map((column) => (
        <section
          key={column.status}
          {...getColumnProps(column.status)}
          className={cn(styles.column, overStatus === column.status && styles.over)}
          aria-label={PROJECT_STATUS_CONFIG[column.status].label}
        >
          <header className={styles.columnHeader}>
            <StatusBadge config={PROJECT_STATUS_CONFIG[column.status]} />
            <span className={styles.count}>{column.projects.length}</span>
          </header>
          <div className={styles.cards}>
            {column.projects.map((project) => (
              <ProjectCard
                key={project.id}
                project={project}
                clientName={clients.get(project.clientId)?.companyName}
                assigneeNames={project.assigneeIds.map((id) => developers.get(id)?.fullName ?? id)}
                isDragging={draggedId === project.id}
                canMove={canMove}
                dragProps={getCardProps(project)}
                onOpen={() => onOpen(project)}
                onMove={(status) => onMove(project.id, status)}
              />
            ))}
            {column.projects.length === 0 && (
              <p className={styles.empty}>
                {overStatus === column.status ? messages.projects.dropHere : messages.projects.emptyColumn}
              </p>
            )}
          </div>
        </section>
      ))}
    </div>
  )
}
