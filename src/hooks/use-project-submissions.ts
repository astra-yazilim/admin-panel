import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { queryKeys } from '@/lib/query-client'
import { showToast } from '@/lib/show-toast'
import type { ProjectFormValues } from '@/schemas/project.schema'
import { projectSubmissionService, type SubmissionReview } from '@/services/project-submission.service'
import { PERMISSIONS, type ProjectSubmission } from '@/types'
import { messages } from '@/utils/validations/messages'
import { useAuth } from './use-auth'

export function useProjectSubmissions() {
  const { can } = useAuth()
  return useQuery({
    queryKey: queryKeys.submissions,
    queryFn: projectSubmissionService.list,
    enabled: can(PERMISSIONS.SUBMISSIONS_VIEW),
  })
}

export function useUpdateSubmissionReview() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ id, review }: { id: string; review: SubmissionReview }) =>
      projectSubmissionService.updateReview(id, review),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.submissions })
      showToast.success(messages.submissions.toast.updated)
    },
  })
}

export function useConvertSubmission() {
  const queryClient = useQueryClient()
  const { user } = useAuth()
  return useMutation({
    mutationFn: ({ submission, values }: { submission: ProjectSubmission; values: ProjectFormValues }) =>
      projectSubmissionService.convertToProject(submission, values, user?.fullName ?? ''),
    onSuccess: (project) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.submissions })
      queryClient.invalidateQueries({ queryKey: queryKeys.allProjects })
      queryClient.invalidateQueries({ queryKey: queryKeys.clients })
      showToast.success(messages.submissions.toast.converted, project.code)
    },
  })
}
