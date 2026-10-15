import { Users } from 'lucide-react'
import { useMemo, useState } from 'react'
import { EmptyState } from '@/components/common/empty-state/empty-state'
import { SearchInput } from '@/components/common/search-input/search-input'
import { SelectField } from '@/components/common/select-field/select-field'
import { useSurveys } from '@/hooks/use-clients'
import { useDevelopers } from '@/hooks/use-developers'
import { useProjects } from '@/hooks/use-projects'
import type { Developer, DeveloperType, SeniorityLevel } from '@/types'
import { ALL_FILTER_VALUE, DEVELOPER_TYPE_CONFIG, SENIORITY_LABELS } from '@/utils/validations/constants'
import { getDeveloperPerformance, matchesSearch, toOptions, toStatusOptions } from '@/utils/validations/helpers'
import { messages } from '@/utils/validations/messages'
import { DeveloperCard } from '../developer-card/developer-card'
import { DeveloperProfileSheet } from '../developer-profile-sheet/developer-profile-sheet'
import styles from './developer-network.module.css'

type TypeFilter = DeveloperType | typeof ALL_FILTER_VALUE
type SeniorityFilter = SeniorityLevel | typeof ALL_FILTER_VALUE

const TYPE_OPTIONS = [{ value: ALL_FILTER_VALUE, label: messages.developers.allTypes }, ...toStatusOptions(DEVELOPER_TYPE_CONFIG)]
const SENIORITY_OPTIONS = [
  { value: ALL_FILTER_VALUE, label: messages.developers.allSeniorities },
  ...toOptions(SENIORITY_LABELS),
]

export function DeveloperNetwork() {
  const { data: developers = [] } = useDevelopers()
  const { data: projects = [] } = useProjects()
  const { data: surveys = [] } = useSurveys()
  const [search, setSearch] = useState('')
  const [type, setType] = useState<TypeFilter>(ALL_FILTER_VALUE)
  const [seniority, setSeniority] = useState<SeniorityFilter>(ALL_FILTER_VALUE)
  const [selected, setSelected] = useState<Developer>()

  const activeProjectCount = (developerId: string) =>
    projects.filter((project) => project.status !== 'live' && project.assigneeIds.includes(developerId)).length

  const filtered = useMemo(
    () =>
      developers.filter(
        (developer) =>
          (type === ALL_FILTER_VALUE || developer.type === type) &&
          (seniority === ALL_FILTER_VALUE || developer.seniority === seniority) &&
          matchesSearch(search, developer.fullName, developer.title, ...developer.techStack),
      ),
    [developers, type, seniority, search],
  )

  return (
    <div className={styles.root}>
      <div className={styles.filters}>
        <SearchInput value={search} onChange={setSearch} placeholder={messages.developers.searchPlaceholder} />
        <SelectField<TypeFilter> value={type} onValueChange={setType} options={TYPE_OPTIONS} className={styles.select} />
        <SelectField<SeniorityFilter>
          value={seniority}
          onValueChange={setSeniority}
          options={SENIORITY_OPTIONS}
          className={styles.select}
        />
      </div>
      {filtered.length === 0 ? (
        <EmptyState icon={Users} title={messages.developers.empty} />
      ) : (
        <div className={styles.grid}>
          {filtered.map((developer) => (
            <DeveloperCard
              key={developer.id}
              developer={developer}
              performance={getDeveloperPerformance(developer.id, surveys)}
              activeProjectCount={activeProjectCount(developer.id)}
              onSelect={() => setSelected(developer)}
            />
          ))}
        </div>
      )}
      <DeveloperProfileSheet
        developer={selected}
        surveys={surveys}
        projects={projects}
        onOpenChange={(open) => !open && setSelected(undefined)}
      />
    </div>
  )
}
