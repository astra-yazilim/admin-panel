import { ChevronsUpDown } from 'lucide-react'
import { AvatarGroup } from '@/components/common/avatar-group/avatar-group'
import { StatusBadge } from '@/components/common/status-badge/status-badge'
import { Button } from '@/components/ui/button'
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command'
import { Checkbox } from '@/components/ui/checkbox'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import type { Developer } from '@/types'
import { DEVELOPER_TYPE_CONFIG, SENIORITY_LABELS } from '@/utils/validations/constants'
import { messages } from '@/utils/validations/messages'
import styles from './assignee-picker.module.css'

interface AssigneePickerProps {
  developers: Developer[]
  value: string[]
  onChange: (value: string[]) => void
}

export function AssigneePicker({ developers, value, onChange }: AssigneePickerProps) {
  const selectedNames = developers.filter((developer) => value.includes(developer.id)).map((d) => d.fullName)

  const toggle = (id: string) =>
    onChange(value.includes(id) ? value.filter((item) => item !== id) : [...value, id])

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button type="button" variant="outline" className={styles.trigger}>
          {selectedNames.length > 0 ? (
            <AvatarGroup names={selectedNames} max={5} />
          ) : (
            <span className={styles.placeholder}>{messages.projects.placeholders.assignees}</span>
          )}
          <ChevronsUpDown className={styles.chevron} />
        </Button>
      </PopoverTrigger>
      <PopoverContent className={styles.content} align="start">
        <Command>
          <CommandInput placeholder={messages.common.search} />
          <CommandList>
            <CommandEmpty>{messages.common.noResults}</CommandEmpty>
            <CommandGroup>
              {developers.map((developer) => (
                <CommandItem
                  key={developer.id}
                  value={`${developer.fullName} ${developer.title}`}
                  onSelect={() => toggle(developer.id)}
                >
                  <Checkbox checked={value.includes(developer.id)} className={styles.checkbox} />
                  <span className={styles.identity}>
                    <span className={styles.name}>{developer.fullName}</span>
                    <span className={styles.title}>
                      {developer.title} · {SENIORITY_LABELS[developer.seniority]}
                    </span>
                  </span>
                  <StatusBadge config={DEVELOPER_TYPE_CONFIG[developer.type]} />
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  )
}
