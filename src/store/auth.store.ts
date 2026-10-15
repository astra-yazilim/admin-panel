import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { Session, User } from '@/types'
import { STORAGE_KEYS } from '@/utils/validations/constants'

interface AuthState {
  session: Session | null
  setSession: (session: Session) => void
  updateUser: (user: User) => void
  clearSession: () => void
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      session: null,
      setSession: (session) => set({ session }),
      updateUser: (user) => set((state) => (state.session ? { session: { ...state.session, user } } : state)),
      clearSession: () => set({ session: null }),
    }),
    { name: STORAGE_KEYS.auth },
  ),
)
