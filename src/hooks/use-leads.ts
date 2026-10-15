import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { queryKeys } from '@/lib/query-client'
import { showToast } from '@/lib/show-toast'
import type { LeadFormValues } from '@/schemas/lead.schema'
import type { ProjectFormValues } from '@/schemas/project.schema'
import { leadService } from '@/services/lead.service'
import { PERMISSIONS, type Lead, type LeadStatus } from '@/types'
import { messages } from '@/utils/validations/messages'
import { useAuth } from './use-auth'

export function useLeads() {
  const { can } = useAuth()
  return useQuery({ queryKey: queryKeys.leads, queryFn: leadService.list, enabled: can(PERMISSIONS.LEADS_VIEW) })
}

export function useCreateLead() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (values: LeadFormValues) => leadService.create(values),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.leads })
      showToast.success(messages.leads.toast.created)
    },
  })
}

export function useUpdateLeadStatus() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ id, status }: { id: string; status: LeadStatus }) => leadService.updateStatus(id, status),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.leads })
      showToast.success(messages.leads.toast.statusUpdated)
    },
  })
}

export function useUpdateLeadNote() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ id, note }: { id: string; note: string }) => leadService.updateNote(id, note),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.leads })
      showToast.success(messages.leads.toast.noteSaved)
    },
  })
}

export function useConvertLead() {
  const queryClient = useQueryClient()
  const { user } = useAuth()
  return useMutation({
    mutationFn: ({ lead, values }: { lead: Lead; values: ProjectFormValues }) =>
      leadService.convertToProject(lead, values, user?.fullName ?? ''),
    onSuccess: (project) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.leads })
      queryClient.invalidateQueries({ queryKey: queryKeys.allProjects })
      queryClient.invalidateQueries({ queryKey: queryKeys.clients })
      showToast.success(messages.leads.toast.converted, project.code)
    },
  })
}
