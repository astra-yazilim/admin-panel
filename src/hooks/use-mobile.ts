import { useSyncExternalStore } from 'react'
import { MOBILE_BREAKPOINT_PX } from '@/utils/validations/constants'

const query = `(max-width: ${MOBILE_BREAKPOINT_PX - 1}px)`

const subscribe = (onChange: () => void) => {
  const mediaQuery = window.matchMedia(query)
  mediaQuery.addEventListener('change', onChange)
  return () => mediaQuery.removeEventListener('change', onChange)
}

const getSnapshot = () => window.matchMedia(query).matches

export function useIsMobile() {
  return useSyncExternalStore(subscribe, getSnapshot, () => false)
}
