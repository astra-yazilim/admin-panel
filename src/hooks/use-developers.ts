import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { queryKeys } from '@/lib/query-client'
import { showToast } from '@/lib/show-toast'
import { developerService, type ApplicationUpdate } from '@/services/developer.service'
import { PERMISSIONS, type DeveloperApplication, type SeniorityLevel, type TrainingStatus } from '@/types'
import { messages } from '@/utils/validations/messages'
import { useAuth } from './use-auth'

export function useDevelopers() {
  return useQuery({ queryKey: queryKeys.developers, queryFn: developerService.listDevelopers })
}

function useCanViewNetwork() {
  const { can } = useAuth()
  return can(PERMISSIONS.DEVELOPERS_VIEW)
}

export function useApplications() {
  return useQuery({
    queryKey: queryKeys.applications,
    queryFn: developerService.listApplications,
    enabled: useCanViewNetwork(),
  })
}

export function useTrainingModules() {
  return useQuery({
    queryKey: queryKeys.trainingModules,
    queryFn: developerService.listTrainingModules,
    enabled: useCanViewNetwork(),
  })
}

export function useTrainingAssignments() {
  return useQuery({
    queryKey: queryKeys.trainingAssignments,
    queryFn: developerService.listTrainingAssignments,
    enabled: useCanViewNetwork(),
  })
}

export function useUpdateApplication() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ id, update }: { id: string; update: ApplicationUpdate }) =>
      developerService.updateApplication(id, update),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.applications })
      showToast.success(messages.developers.toast.applicationUpdated)
    },
  })
}

export function useApproveApplication() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({
      application,
      seniority,
      reviewerNote,
    }: {
      application: DeveloperApplication
      seniority: SeniorityLevel
      reviewerNote: string
    }) => developerService.approveApplication(application, seniority, reviewerNote),
    onSuccess: (developer) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.applications })
      queryClient.invalidateQueries({ queryKey: queryKeys.developers })
      showToast.success(messages.developers.toast.approved, developer.fullName)
    },
  })
}

export function useUpdateTrainingStatus() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ id, status }: { id: string; status: TrainingStatus }) =>
      developerService.updateTrainingStatus(id, status),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: queryKeys.trainingAssignments }),
  })
}
