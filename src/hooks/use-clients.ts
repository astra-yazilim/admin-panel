import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { queryKeys } from '@/lib/query-client'
import { showToast } from '@/lib/show-toast'
import { clientService } from '@/services/client.service'
import { PERMISSIONS, type Project } from '@/types'
import { messages } from '@/utils/validations/messages'
import { useAuth } from './use-auth'

export function useClients() {
  return useQuery({ queryKey: queryKeys.clients, queryFn: clientService.list })
}

export function useSurveys() {
  const { can } = useAuth()
  return useQuery({
    queryKey: queryKeys.surveys,
    queryFn: clientService.listSurveys,
    enabled: can(PERMISSIONS.CLIENTS_VIEW),
  })
}

export function useSendSurvey() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (project: Project) => clientService.sendSurvey(project),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.surveys })
      showToast.success(messages.clients.toast.surveySent)
    },
  })
}
