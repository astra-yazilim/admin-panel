import { useSearchParams } from 'react-router-dom'
import type { ProjectFilterState } from '@/pages/projects/components/project-filters/project-filters'
import type { OwnerType, ProjectCategory } from '@/types'
import {
  ALL_FILTER_VALUE,
  OWNER_TYPE_CONFIG,
  PROJECT_BOARD_PARAMS,
  PROJECT_CATEGORY_LABELS,
} from '@/utils/validations/constants'

const isCategory = (value: string | null): value is ProjectCategory => Boolean(value && value in PROJECT_CATEGORY_LABELS)
const isOwner = (value: string | null): value is OwnerType => Boolean(value && value in OWNER_TYPE_CONFIG)

export function useProjectBoardParams() {
  const [searchParams, setSearchParams] = useSearchParams()
  const category = searchParams.get(PROJECT_BOARD_PARAMS.category)
  const owner = searchParams.get(PROJECT_BOARD_PARAMS.owner)

  const filters: ProjectFilterState = {
    search: searchParams.get(PROJECT_BOARD_PARAMS.search) ?? '',
    category: isCategory(category) ? category : ALL_FILTER_VALUE,
    owner: isOwner(owner) ? owner : ALL_FILTER_VALUE,
  }
  const selectedId = searchParams.get(PROJECT_BOARD_PARAMS.project) ?? undefined

  const updateParams = (updates: Record<string, string | undefined>) =>
    setSearchParams(
      (current) => {
        const next = new URLSearchParams(current)
        Object.entries(updates).forEach(([key, value]) =>
          value && value !== ALL_FILTER_VALUE ? next.set(key, value) : next.delete(key),
        )
        return next
      },
      { replace: true },
    )

  const setFilters = (next: ProjectFilterState) =>
    updateParams({
      [PROJECT_BOARD_PARAMS.search]: next.search,
      [PROJECT_BOARD_PARAMS.category]: next.category,
      [PROJECT_BOARD_PARAMS.owner]: next.owner,
    })

  const setSelectedId = (projectId?: string) => updateParams({ [PROJECT_BOARD_PARAMS.project]: projectId })

  return { filters, setFilters, selectedId, setSelectedId }
}
