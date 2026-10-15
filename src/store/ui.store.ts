import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { STORAGE_KEYS } from '@/utils/validations/constants'

interface UiState {
  isSidebarOpen: boolean
  isCommandMenuOpen: boolean
  setSidebarOpen: (isOpen: boolean) => void
  setCommandMenuOpen: (isOpen: boolean) => void
}

export const useUiStore = create<UiState>()(
  persist(
    (set) => ({
      isSidebarOpen: true,
      isCommandMenuOpen: false,
      setSidebarOpen: (isSidebarOpen) => set({ isSidebarOpen }),
      setCommandMenuOpen: (isCommandMenuOpen) => set({ isCommandMenuOpen }),
    }),
    {
      name: STORAGE_KEYS.ui,
      partialize: (state) => ({ isSidebarOpen: state.isSidebarOpen }),
    },
  ),
)
