import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { queryKeys } from '@/lib/query-client'
import { showToast } from '@/lib/show-toast'
import { financeService } from '@/services/finance.service'
import { PERMISSIONS, type PaymentStage } from '@/types'
import { messages } from '@/utils/validations/messages'
import { useAuth } from './use-auth'

export function useFinances() {
  const { can } = useAuth()
  return useQuery({ queryKey: queryKeys.finances, queryFn: financeService.list, enabled: can(PERMISSIONS.FINANCE_VIEW) })
}

export function useMarkPaymentPaid() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ id, stage }: { id: string; stage: PaymentStage }) => financeService.markPaymentPaid(id, stage),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.finances })
      showToast.success(messages.finance.toast.paymentRecorded)
    },
  })
}
