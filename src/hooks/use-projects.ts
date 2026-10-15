import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { queryKeys } from '@/lib/query-client'
import { showToast } from '@/lib/show-toast'
import type { ProjectFormValues } from '@/schemas/project.schema'
import { projectService } from '@/services/project.service'
import { PERMISSIONS, type Project, type ProjectStatus } from '@/types'
import { messages } from '@/utils/validations/messages'
import { useAuth } from './use-auth'

function useProjectScope() {
  const { user, can } = useAuth()
  return can(PERMISSIONS.PROJECTS_VIEW_ALL) ? undefined : (user?.developerId ?? '')
}

export function useProjects() {
  const { can } = useAuth()
  const assigneeId = useProjectScope()
  return useQuery({
    queryKey: queryKeys.projects(assigneeId),
    queryFn: () => projectService.list({ assigneeId }),
    enabled: can(PERMISSIONS.PROJECTS_VIEW),
  })
}

export function useProject(projectId: string | undefined) {
  const query = useProjects()
  return { ...query, data: query.data?.find((project) => project.id === projectId) }
}

export function useCreateProject() {
  const queryClient = useQueryClient()
  const { user } = useAuth()
  return useMutation({
    mutationFn: (values: ProjectFormValues) => projectService.create(values, user?.fullName ?? ''),
    onSuccess: (project) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.allProjects })
      showToast.success(messages.projects.toast.created, project.title)
    },
  })
}

export function useUpdateProject() {
  const queryClient = useQueryClient()
  const { user } = useAuth()
  return useMutation({
    mutationFn: ({ id, values }: { id: string; values: ProjectFormValues }) =>
      projectService.update(id, values, user?.fullName ?? ''),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.allProjects })
      showToast.success(messages.projects.toast.updated)
    },
  })
}

export function useMoveProject() {
  const queryClient = useQueryClient()
  const { user } = useAuth()
  return useMutation({
    mutationFn: ({ id, status }: { id: string; status: ProjectStatus }) =>
      projectService.move(id, status, user?.fullName ?? ''),
    onMutate: async ({ id, status }) => {
      await queryClient.cancelQueries({ queryKey: queryKeys.allProjects })
      const snapshot = queryClient.getQueriesData<Project[]>({ queryKey: queryKeys.allProjects })
      queryClient.setQueriesData<Project[]>({ queryKey: queryKeys.allProjects }, (projects) =>
        projects?.map((project) => (project.id === id ? { ...project, status } : project)),
      )
      return { snapshot }
    },
    onError: (_error, _variables, context) => {
      context?.snapshot.forEach(([key, data]) => queryClient.setQueryData(key, data))
    },
    onSettled: () => queryClient.invalidateQueries({ queryKey: queryKeys.allProjects }),
  })
}

export function useAddProjectNote() {
  const queryClient = useQueryClient()
  const { user } = useAuth()
  return useMutation({
    mutationFn: ({ id, note }: { id: string; note: string }) =>
      projectService.addNote(id, note, user?.fullName ?? ''),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: queryKeys.allProjects }),
  })
}
