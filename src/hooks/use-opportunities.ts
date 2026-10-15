import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { queryKeys } from '@/lib/query-client'
import { showToast } from '@/lib/show-toast'
import type { InterestFormValues, OpportunityFormValues } from '@/schemas/opportunity.schema'
import { opportunityService } from '@/services/opportunity.service'
import { PERMISSIONS, type InterestStatus } from '@/types'
import { messages } from '@/utils/validations/messages'
import { useAuth } from './use-auth'

export function useOpportunities() {
  const { can } = useAuth()
  return useQuery({
    queryKey: queryKeys.opportunities,
    queryFn: opportunityService.list,
    enabled: can(PERMISSIONS.OPPORTUNITIES_MANAGE),
  })
}

export function usePublishedOpportunities() {
  const { can } = useAuth()
  return useQuery({
    queryKey: queryKeys.publishedOpportunities,
    queryFn: opportunityService.listPublished,
    enabled: can(PERMISSIONS.OPPORTUNITIES_BROWSE),
  })
}

export function useSaveOpportunity() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ id, values }: { id?: string; values: OpportunityFormValues }) =>
      id ? opportunityService.update(id, values) : opportunityService.create(values),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.opportunities })
      queryClient.invalidateQueries({ queryKey: queryKeys.submissions })
      showToast.success(messages.investors.toast.opportunitySaved)
    },
  })
}

export function useInterests() {
  const { can } = useAuth()
  return useQuery({
    queryKey: queryKeys.interests,
    queryFn: opportunityService.listInterests,
    enabled: can(PERMISSIONS.OPPORTUNITIES_MANAGE),
  })
}

export function useMyInterests() {
  const { user } = useAuth()
  return useQuery({
    queryKey: queryKeys.myInterests(user?.investorId),
    queryFn: () => opportunityService.listInterestsByInvestor(user?.investorId ?? ''),
    enabled: Boolean(user?.investorId),
  })
}

export function useCreateInterest() {
  const queryClient = useQueryClient()
  const { user } = useAuth()
  return useMutation({
    mutationFn: ({ opportunityId, values }: { opportunityId: string; values: InterestFormValues }) =>
      opportunityService.createInterest(user?.investorId ?? '', opportunityId, values),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.interests })
      showToast.success(messages.opportunities.interest.toast)
    },
  })
}

export function useUpdateInterestStatus() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ id, status }: { id: string; status: InterestStatus }) =>
      opportunityService.updateInterestStatus(id, status),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.interests })
      showToast.success(messages.investors.toast.interestUpdated)
    },
  })
}
