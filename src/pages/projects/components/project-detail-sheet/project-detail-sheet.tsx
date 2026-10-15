import { Maximize2, Pencil } from 'lucide-react'
import { Link } from 'react-router-dom'
import { StatusBadge } from '@/components/common/status-badge/status-badge'
import { Button } from '@/components/ui/button'
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from '@/components/ui/sheet'
import type { Project } from '@/types'
import { PROJECT_STATUS_CONFIG, ROUTE_PATHS } from '@/utils/validations/constants'
import { buildPath } from '@/utils/validations/formatters'
import { messages } from '@/utils/validations/messages'
import { ProjectDetail } from '../project-detail/project-detail'
import styles from './project-detail-sheet.module.css'

interface ProjectDetailSheetProps {
  project: Project | undefined
  onOpenChange: (open: boolean) => void
  onEdit?: (project: Project) => void
}

export function ProjectDetailSheet({ project, onOpenChange, onEdit }: ProjectDetailSheetProps) {
  return (
    <Sheet open={Boolean(project)} onOpenChange={onOpenChange}>
      <SheetContent className={styles.content}>
        {project && (
          <>
            <SheetHeader className={styles.header}>
              <div className={styles.meta}>
                <span className={styles.code}>{project.code}</span>
                <StatusBadge config={PROJECT_STATUS_CONFIG[project.status]} />
              </div>
              <SheetTitle className={styles.title}>{project.title}</SheetTitle>
              <SheetDescription className={styles.srOnly}>{project.description}</SheetDescription>
              <div className={styles.actions}>
                <Button asChild variant="outline" size="sm">
                  <Link to={buildPath(ROUTE_PATHS.projectDetail, { projectId: project.id })}>
                    <Maximize2 />
                    {messages.projects.openPage}
                  </Link>
                </Button>
                {onEdit && (
                  <Button variant="outline" size="sm" onClick={() => onEdit(project)}>
                    <Pencil />
                    {messages.common.edit}
                  </Button>
                )}
              </div>
            </SheetHeader>
            <div className={styles.body}>
              <ProjectDetail project={project} />
            </div>
          </>
        )}
      </SheetContent>
    </Sheet>
  )
}
