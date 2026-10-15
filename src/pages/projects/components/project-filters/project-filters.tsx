import { SearchInput } from '@/components/common/search-input/search-input'
import { SelectField } from '@/components/common/select-field/select-field'
import type { OwnerType, ProjectCategory } from '@/types'
import { ALL_FILTER_VALUE, OWNER_TYPE_CONFIG, PROJECT_CATEGORY_LABELS } from '@/utils/validations/constants'
import { toOptions, toStatusOptions } from '@/utils/validations/helpers'
import { messages } from '@/utils/validations/messages'
import styles from './project-filters.module.css'

export type CategoryFilter = ProjectCategory | typeof ALL_FILTER_VALUE
export type OwnerFilter = OwnerType | typeof ALL_FILTER_VALUE

export interface ProjectFilterState {
  search: string
  category: CategoryFilter
  owner: OwnerFilter
}

interface ProjectFiltersProps {
  value: ProjectFilterState
  onChange: (value: ProjectFilterState) => void
}

const CATEGORY_OPTIONS = [
  { value: ALL_FILTER_VALUE, label: messages.projects.allCategories },
  ...toOptions(PROJECT_CATEGORY_LABELS),
]

const OWNER_OPTIONS = [
  { value: ALL_FILTER_VALUE, label: messages.projects.allOwners },
  ...toStatusOptions(OWNER_TYPE_CONFIG),
]

export function ProjectFilters({ value, onChange }: ProjectFiltersProps) {
  return (
    <div className={styles.root}>
      <SearchInput
        value={value.search}
        onChange={(search) => onChange({ ...value, search })}
        placeholder={messages.projects.searchPlaceholder}
      />
      <SelectField<CategoryFilter>
        value={value.category}
        onValueChange={(category) => onChange({ ...value, category })}
        options={CATEGORY_OPTIONS}
        className={styles.select}
        aria-label={messages.projects.fields.category}
      />
      <SelectField<OwnerFilter>
        value={value.owner}
        onValueChange={(owner) => onChange({ ...value, owner })}
        options={OWNER_OPTIONS}
        className={styles.select}
        aria-label={messages.projects.fields.ownerType}
      />
    </div>
  )
}
