import { zodResolver } from '@hookform/resolvers/zod'
import { Loader2 } from 'lucide-react'
import { useForm } from 'react-hook-form'
import { SelectField } from '@/components/common/select-field/select-field'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { useCreateLead } from '@/hooks/use-leads'
import { leadSchema, type LeadFormValues } from '@/schemas/lead.schema'
import { SERVICE_LABELS } from '@/utils/validations/constants'
import { toOptions } from '@/utils/validations/helpers'
import { messages } from '@/utils/validations/messages'
import styles from './lead-form-dialog.module.css'

const SERVICE_OPTIONS = toOptions(SERVICE_LABELS)
const { fields, placeholders } = messages.leads

const DEFAULT_VALUES: LeadFormValues = {
  fullName: '',
  email: '',
  phone: '',
  companyName: '',
  website: '',
  service: 'bug_fix',
  message: '',
  kvkkConsent: false,
}

type TextFieldName = 'fullName' | 'email' | 'phone' | 'companyName' | 'website'

const TEXT_FIELDS: { name: TextFieldName; type?: string }[] = [
  { name: 'fullName' },
  { name: 'email', type: 'email' },
  { name: 'phone', type: 'tel' },
  { name: 'companyName' },
  { name: 'website' },
]

interface LeadFormDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function LeadFormDialog({ open, onOpenChange }: LeadFormDialogProps) {
  const createLead = useCreateLead()
  const form = useForm<LeadFormValues>({ resolver: zodResolver(leadSchema), defaultValues: DEFAULT_VALUES })

  const onSubmit = (values: LeadFormValues) =>
    createLead.mutate(values, {
      onSuccess: () => {
        form.reset(DEFAULT_VALUES)
        onOpenChange(false)
      },
    })

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className={styles.content}>
        <DialogHeader>
          <DialogTitle>{messages.leads.newLead}</DialogTitle>
          <DialogDescription>{messages.leads.description}</DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className={styles.form} noValidate>
            <div className={styles.grid}>
              {TEXT_FIELDS.map(({ name, type }) => (
                <FormField
                  key={name}
                  control={form.control}
                  name={name}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{fields[name]}</FormLabel>
                      <FormControl>
                        <Input type={type} placeholder={placeholders[name]} {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              ))}
              <FormField
                control={form.control}
                name="service"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{fields.service}</FormLabel>
                    <FormControl>
                      <SelectField value={field.value} onValueChange={field.onChange} options={SERVICE_OPTIONS} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <FormField
              control={form.control}
              name="message"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{fields.message}</FormLabel>
                  <FormControl>
                    <Textarea rows={3} placeholder={placeholders.message} {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="kvkkConsent"
              render={({ field }) => (
                <FormItem>
                  <div className={styles.consent}>
                    <FormControl>
                      <Checkbox checked={field.value} onCheckedChange={(checked) => field.onChange(checked === true)} />
                    </FormControl>
                    <FormLabel>{fields.kvkkConsent}</FormLabel>
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                {messages.common.cancel}
              </Button>
              <Button type="submit" disabled={createLead.isPending}>
                {createLead.isPending && <Loader2 className={styles.spinner} />}
                {messages.common.create}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
