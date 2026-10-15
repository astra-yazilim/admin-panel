import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { queryKeys } from '@/lib/query-client'
import { showToast } from '@/lib/show-toast'
import { userService } from '@/services/user.service'
import { useAuthStore } from '@/store/auth.store'
import { PERMISSIONS, type Role } from '@/types'
import { messages } from '@/utils/validations/messages'
import { useAuth } from './use-auth'

export function useUsers() {
  const { can } = useAuth()
  return useQuery({ queryKey: queryKeys.users, queryFn: userService.list, enabled: can(PERMISSIONS.SETTINGS_MANAGE) })
}

export function useUpdateUserRole() {
  const queryClient = useQueryClient()
  const session = useAuthStore((state) => state.session)
  const updateUser = useAuthStore((state) => state.updateUser)
  return useMutation({
    mutationFn: ({ id, role }: { id: string; role: Role }) => userService.updateRole(id, role),
    onSuccess: (user) => {
      if (session?.user.id === user.id) updateUser(user)
      queryClient.invalidateQueries({ queryKey: queryKeys.users })
      showToast.success(messages.settings.toast.roleUpdated, user.fullName)
    },
  })
}
