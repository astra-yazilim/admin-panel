import { createContext, useCallback, useMemo, type ReactNode } from 'react'
import { queryClient } from '@/lib/query-client'
import { authService } from '@/services/auth.service'
import { useAuthStore } from '@/store/auth.store'
import type { Credentials, Permission, User } from '@/types'
import { hasPermission } from '@/utils/validations/helpers'

interface AuthContextValue {
  user: User | null
  isAuthenticated: boolean
  login: (credentials: Credentials) => Promise<User>
  logout: () => void
  can: (permission: Permission) => boolean
}

export const AuthContext = createContext<AuthContextValue | null>(null)

export function AuthProvider({ children }: { children: ReactNode }) {
  const session = useAuthStore((state) => state.session)
  const setSession = useAuthStore((state) => state.setSession)
  const clearSession = useAuthStore((state) => state.clearSession)
  const user = session?.user ?? null

  const login = useCallback(
    async (credentials: Credentials) => {
      const nextSession = await authService.login(credentials)
      setSession(nextSession)
      return nextSession.user
    },
    [setSession],
  )

  const logout = useCallback(() => {
    clearSession()
    queryClient.clear()
  }, [clearSession])

  const can = useCallback((permission: Permission) => hasPermission(user?.role, permission), [user?.role])

  const value = useMemo(
    () => ({ user, isAuthenticated: Boolean(user), login, logout, can }),
    [user, login, logout, can],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
