import { useMemo, useState, type DragEvent } from 'react'
import type { Project, ProjectStatus } from '@/types'
import { PROJECT_STATUS_ORDER } from '@/utils/validations/constants'

const DRAG_DATA_TYPE = 'text/plain'

interface UseKanbanOptions {
  projects: Project[]
  isDragEnabled: boolean
  onMove: (projectId: string, status: ProjectStatus) => void
}

export function useKanban({ projects, isDragEnabled, onMove }: UseKanbanOptions) {
  const [draggedId, setDraggedId] = useState<string | null>(null)
  const [overStatus, setOverStatus] = useState<ProjectStatus | null>(null)

  const columns = useMemo(
    () =>
      PROJECT_STATUS_ORDER.map((status) => ({
        status,
        projects: projects.filter((project) => project.status === status),
      })),
    [projects],
  )

  const resetDrag = () => {
    setDraggedId(null)
    setOverStatus(null)
  }

  const getCardProps = (project: Project) => ({
    draggable: isDragEnabled,
    onDragStart: (event: DragEvent<HTMLElement>) => {
      event.dataTransfer.setData(DRAG_DATA_TYPE, project.id)
      event.dataTransfer.effectAllowed = 'move'
      setDraggedId(project.id)
    },
    onDragEnd: resetDrag,
  })

  const getColumnProps = (status: ProjectStatus) => ({
    onDragOver: (event: DragEvent<HTMLElement>) => {
      if (!isDragEnabled) return
      event.preventDefault()
      setOverStatus(status)
    },
    onDragLeave: (event: DragEvent<HTMLElement>) => {
      if (!event.currentTarget.contains(event.relatedTarget as Node)) setOverStatus(null)
    },
    onDrop: (event: DragEvent<HTMLElement>) => {
      event.preventDefault()
      const projectId = event.dataTransfer.getData(DRAG_DATA_TYPE)
      const project = projects.find((item) => item.id === projectId)
      if (project && project.status !== status) onMove(projectId, status)
      resetDrag()
    },
  })

  return { columns, draggedId, overStatus, getCardProps, getColumnProps }
}
