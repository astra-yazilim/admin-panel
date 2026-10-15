import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { cn } from '@/lib/utils'
import type { Option } from '@/types'
import { messages } from '@/utils/validations/messages'
import styles from './select-field.module.css'

interface SelectFieldProps<T extends string> {
  value: T | undefined
  onValueChange: (value: T) => void
  options: Option<T>[]
  placeholder?: string
  disabled?: boolean
  className?: string
  id?: string
  'aria-label'?: string
}

export function SelectField<T extends string>({
  value,
  onValueChange,
  options,
  placeholder = messages.common.selectPlaceholder,
  disabled,
  className,
  ...props
}: SelectFieldProps<T>) {
  return (
    <Select value={value} onValueChange={(next) => onValueChange(next as T)} disabled={disabled}>
      <SelectTrigger className={cn(styles.trigger, className)} {...props}>
        <SelectValue placeholder={placeholder} />
      </SelectTrigger>
      <SelectContent>
        {options.map((option) => (
          <SelectItem key={option.value} value={option.value}>
            {option.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  )
}
