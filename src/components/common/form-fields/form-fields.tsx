import type { ReactNode } from 'react'
import type { Control, FieldPath, FieldValues } from 'react-hook-form'
import { SelectField } from '@/components/common/select-field/select-field'
import { FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { cn } from '@/lib/utils'
import type { Option } from '@/types'
import styles from './form-fields.module.css'

interface BaseFieldProps<T extends FieldValues> {
  control: Control<T>
  name: FieldPath<T>
  label: string
  description?: string
  required?: boolean
  fullWidth?: boolean
}

function FieldLabel({ label, required }: { label: string; required?: boolean }) {
  return (
    <FormLabel>
      {label}
      {required && <span className={styles.required}>*</span>}
    </FormLabel>
  )
}

function FieldShell({
  label,
  required,
  description,
  fullWidth,
  children,
}: Omit<BaseFieldProps<FieldValues>, 'control' | 'name'> & { children: ReactNode }) {
  return (
    <FormItem className={cn(fullWidth && styles.fullWidth)}>
      <FieldLabel label={label} required={required} />
      {children}
      {description && <FormDescription>{description}</FormDescription>}
      <FormMessage />
    </FormItem>
  )
}

export function TextFormField<T extends FieldValues>({
  control,
  name,
  placeholder,
  type,
  ...shell
}: BaseFieldProps<T> & { placeholder?: string; type?: string }) {
  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FieldShell {...shell}>
          <FormControl>
            <Input type={type} placeholder={placeholder} {...field} />
          </FormControl>
        </FieldShell>
      )}
    />
  )
}

export function NumberFormField<T extends FieldValues>({
  control,
  name,
  placeholder,
  ...shell
}: BaseFieldProps<T> & { placeholder?: string }) {
  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FieldShell {...shell}>
          <FormControl>
            <Input
              type="number"
              inputMode="numeric"
              placeholder={placeholder}
              value={Number.isNaN(field.value) ? '' : field.value}
              onChange={(event) => field.onChange(event.target.valueAsNumber)}
              onBlur={field.onBlur}
              name={field.name}
              ref={field.ref}
            />
          </FormControl>
        </FieldShell>
      )}
    />
  )
}

export function TextareaFormField<T extends FieldValues>({
  control,
  name,
  placeholder,
  rows = 4,
  ...shell
}: BaseFieldProps<T> & { placeholder?: string; rows?: number }) {
  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FieldShell fullWidth {...shell}>
          <FormControl>
            <Textarea rows={rows} placeholder={placeholder} {...field} />
          </FormControl>
        </FieldShell>
      )}
    />
  )
}

export function SelectFormField<T extends FieldValues>({
  control,
  name,
  options,
  ...shell
}: BaseFieldProps<T> & { options: Option[] }) {
  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FieldShell {...shell}>
          <FormControl>
            <SelectField value={field.value} onValueChange={field.onChange} options={options} />
          </FormControl>
        </FieldShell>
      )}
    />
  )
}
