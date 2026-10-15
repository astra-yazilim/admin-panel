import { useMemo } from 'react'
import type { Entity } from '@/types'

export function useEntityMap<T extends Entity>(items: T[] | undefined) {
  return useMemo(() => new Map((items ?? []).map((item) => [item.id, item])), [items])
}
