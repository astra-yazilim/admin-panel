import { Plus } from 'lucide-react'
import { useMemo, useState } from 'react'
import { PageHeader } from '@/components/common/page-header/page-header'
import { PageLoader } from '@/components/common/page-loader/page-loader'
import { Button } from '@/components/ui/button'
import { useAuth } from '@/hooks/use-auth'
import { useClients } from '@/hooks/use-clients'
import { useDevelopers } from '@/hooks/use-developers'
import { useEntityMap } from '@/hooks/use-entity-map'
import { useProjectBoardParams } from '@/hooks/use-project-board-params'
import { useMoveProject, useProjects } from '@/hooks/use-projects'
import { PERMISSIONS, type Project } from '@/types'
import { ALL_FILTER_VALUE } from '@/utils/validations/constants'
import { matchesSearch } from '@/utils/validations/helpers'
import { messages } from '@/utils/validations/messages'
import { KanbanBoard } from './components/kanban-board/kanban-board'
import { ProjectDetailSheet } from './components/project-detail-sheet/project-detail-sheet'
import { ProjectFilters } from './components/project-filters/project-filters'
import { ProjectFormSheet } from './components/project-form-sheet/project-form-sheet'

interface FormState {
  isOpen: boolean
  project?: Project
}

export default function ProjectsPage() {
  const { can } = useAuth()
  const { data: projects = [], isLoading } = useProjects()
  const { data: clients } = useClients()
  const { data: developers } = useDevelopers()
  const moveProject = useMoveProject()
  const clientMap = useEntityMap(clients)
  const developerMap = useEntityMap(developers)

  const { filters, setFilters, selectedId, setSelectedId } = useProjectBoardParams()
  const [formState, setFormState] = useState<FormState>({ isOpen: false })
  const canWrite = can(PERMISSIONS.PROJECTS_WRITE)

  const filteredProjects = useMemo(
    () =>
      projects.filter(
        (project) =>
          (filters.category === ALL_FILTER_VALUE || project.category === filters.category) &&
          (filters.owner === ALL_FILTER_VALUE || project.ownerType === filters.owner) &&
          matchesSearch(filters.search, project.title, project.code, ...project.tags),
      ),
    [projects, filters],
  )

  const openEditForm = (project: Project) => {
    setSelectedId(undefined)
    setFormState({ isOpen: true, project })
  }

  return (
    <>
      <PageHeader
        title={messages.projects.title}
        description={messages.projects.description}
        actions={
          canWrite && (
            <Button onClick={() => setFormState({ isOpen: true })}>
              <Plus />
              {messages.projects.newProject}
            </Button>
          )
        }
      />
      <ProjectFilters value={filters} onChange={setFilters} />
      {isLoading ? (
        <PageLoader />
      ) : (
        <KanbanBoard
          projects={filteredProjects}
          clients={clientMap}
          developers={developerMap}
          canMove={can(PERMISSIONS.PROJECTS_MOVE)}
          onMove={(id, status) => moveProject.mutate({ id, status })}
          onOpen={(project) => setSelectedId(project.id)}
        />
      )}
      <ProjectDetailSheet
        project={projects.find((project) => project.id === selectedId)}
        onOpenChange={(open) => !open && setSelectedId(undefined)}
        onEdit={canWrite ? openEditForm : undefined}
      />
      <ProjectFormSheet
        open={formState.isOpen}
        project={formState.project}
        onOpenChange={(isOpen) => setFormState((state) => ({ ...state, isOpen }))}
      />
    </>
  )
}
