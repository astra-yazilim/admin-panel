import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { queryKeys } from '@/lib/query-client'
import { showToast } from '@/lib/show-toast'
import { investorService, type InvestorReview } from '@/services/investor.service'
import { PERMISSIONS, type AccessMethod, type Investor } from '@/types'
import { messages } from '@/utils/validations/messages'
import { useAuth } from './use-auth'

export function useInvestors() {
  const { can } = useAuth()
  return useQuery({
    queryKey: queryKeys.investors,
    queryFn: investorService.list,
    enabled: can(PERMISSIONS.INVESTORS_VIEW),
  })
}

export function useUpdateInvestorReview() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ id, review }: { id: string; review: InvestorReview }) => investorService.updateReview(id, review),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.investors })
      showToast.success(messages.investors.toast.updated)
    },
  })
}

export function useApproveInvestor() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ investor, method, reviewerNote }: { investor: Investor; method: AccessMethod; reviewerNote: string }) =>
      investorService.approve(investor, method, reviewerNote),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.investors })
      queryClient.invalidateQueries({ queryKey: queryKeys.users })
      showToast.success(messages.investors.toast.approved)
    },
  })
}
