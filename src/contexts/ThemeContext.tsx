import { createContext, useCallback, useEffect, useMemo, useState, useSyncExternalStore, type ReactNode } from 'react'
import type { ResolvedTheme, ThemePreference } from '@/types'
import { STORAGE_KEYS } from '@/utils/validations/constants'

const DEFAULT_THEME: ThemePreference = 'system'
const DARK_QUERY = '(prefers-color-scheme: dark)'
const THEMES: ThemePreference[] = ['light', 'dark', 'system']

interface ThemeContextValue {
  theme: ThemePreference
  resolvedTheme: ResolvedTheme
  setTheme: (theme: ThemePreference) => void
}

export const ThemeContext = createContext<ThemeContextValue | null>(null)

const readStoredTheme = (): ThemePreference => {
  try {
    const stored = localStorage.getItem(STORAGE_KEYS.theme) as ThemePreference | null
    return stored && THEMES.includes(stored) ? stored : DEFAULT_THEME
  } catch {
    return DEFAULT_THEME
  }
}

const subscribeToSystemTheme = (onChange: () => void) => {
  const mediaQuery = window.matchMedia(DARK_QUERY)
  mediaQuery.addEventListener('change', onChange)
  return () => mediaQuery.removeEventListener('change', onChange)
}

const getSystemTheme = (): ResolvedTheme => (window.matchMedia(DARK_QUERY).matches ? 'dark' : 'light')

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setThemeState] = useState<ThemePreference>(readStoredTheme)
  const systemTheme = useSyncExternalStore(subscribeToSystemTheme, getSystemTheme, () => 'dark' as const)
  const resolvedTheme = theme === 'system' ? systemTheme : theme

  useEffect(() => {
    document.documentElement.classList.toggle('dark', resolvedTheme === 'dark')
    document.documentElement.style.colorScheme = resolvedTheme
  }, [resolvedTheme])

  const setTheme = useCallback((next: ThemePreference) => {
    setThemeState(next)
    try {
      localStorage.setItem(STORAGE_KEYS.theme, next)
    } catch {
      return
    }
  }, [])

  const value = useMemo(() => ({ theme, resolvedTheme, setTheme }), [theme, resolvedTheme, setTheme])

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
}
