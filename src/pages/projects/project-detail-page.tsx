import { ArrowLeft, FileQuestion, Pencil } from 'lucide-react'
import { useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { EmptyState } from '@/components/common/empty-state/empty-state'
import { PageLoader } from '@/components/common/page-loader/page-loader'
import { StatusBadge } from '@/components/common/status-badge/status-badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { useAuth } from '@/hooks/use-auth'
import { useProject } from '@/hooks/use-projects'
import { PERMISSIONS } from '@/types'
import { PROJECT_STATUS_CONFIG, ROUTE_PATHS } from '@/utils/validations/constants'
import { messages } from '@/utils/validations/messages'
import { ProjectDetail } from './components/project-detail/project-detail'
import { ProjectFormSheet } from './components/project-form-sheet/project-form-sheet'
import styles from './project-detail-page.module.css'

export default function ProjectDetailPage() {
  const { projectId } = useParams()
  const { can } = useAuth()
  const { data: project, isLoading } = useProject(projectId)
  const [isFormOpen, setFormOpen] = useState(false)

  const backLink = (
    <Button asChild variant="ghost" size="sm" className={styles.back}>
      <Link to={ROUTE_PATHS.projects}>
        <ArrowLeft />
        {messages.projects.backToBoard}
      </Link>
    </Button>
  )

  if (isLoading) return <PageLoader />
  if (!project) {
    return (
      <EmptyState
        icon={FileQuestion}
        title={messages.errors.notFound}
        description={messages.errors.pageNotFoundDescription}
        action={backLink}
      />
    )
  }

  return (
    <>
      {backLink}
      <header className={styles.header}>
        <div className={styles.meta}>
          <span className={styles.code}>{project.code}</span>
          <StatusBadge config={PROJECT_STATUS_CONFIG[project.status]} />
        </div>
        <div className={styles.titleRow}>
          <h1 className={styles.title}>{project.title}</h1>
          {can(PERMISSIONS.PROJECTS_WRITE) && (
            <Button variant="outline" onClick={() => setFormOpen(true)}>
              <Pencil />
              {messages.common.edit}
            </Button>
          )}
        </div>
      </header>
      <Card>
        <CardContent>
          <ProjectDetail project={project} />
        </CardContent>
      </Card>
      <ProjectFormSheet open={isFormOpen} onOpenChange={setFormOpen} project={project} />
    </>
  )
}
