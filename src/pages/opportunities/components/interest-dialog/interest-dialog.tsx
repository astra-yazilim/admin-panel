import { zodResolver } from '@hookform/resolvers/zod'
import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { SelectFormField, TextareaFormField } from '@/components/common/form-fields/form-fields'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Form } from '@/components/ui/form'
import { useCreateInterest } from '@/hooks/use-opportunities'
import { interestSchema, type InterestFormValues } from '@/schemas/opportunity.schema'
import type { OpportunitySummary } from '@/types'
import { INVESTMENT_BUDGET_LABELS } from '@/utils/validations/constants'
import { toOptions } from '@/utils/validations/helpers'
import { messages } from '@/utils/validations/messages'
import styles from './interest-dialog.module.css'

const { interest: copy } = messages.opportunities

interface InterestDialogProps {
  opportunity: OpportunitySummary | undefined
  onOpenChange: (open: boolean) => void
}

export function InterestDialog({ opportunity, onOpenChange }: InterestDialogProps) {
  const createInterest = useCreateInterest()
  const form = useForm<InterestFormValues>({ resolver: zodResolver(interestSchema), defaultValues: { note: '' } })

  useEffect(() => {
    if (opportunity) form.reset({ note: '' })
  }, [opportunity, form])

  const onSubmit = (values: InterestFormValues) =>
    opportunity &&
    createInterest.mutate({ opportunityId: opportunity.id, values }, { onSuccess: () => onOpenChange(false) })

  return (
    <Dialog open={Boolean(opportunity)} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{copy.title}</DialogTitle>
          <DialogDescription>
            {opportunity?.title} · {copy.description}
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className={styles.form} noValidate>
            <SelectFormField
              control={form.control}
              name="amountRange"
              label={copy.amount}
              options={toOptions(INVESTMENT_BUDGET_LABELS)}
              required
            />
            <TextareaFormField control={form.control} name="note" label={copy.note} placeholder={copy.notePlaceholder} rows={3} />
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                {messages.common.cancel}
              </Button>
              <Button type="submit" disabled={createInterest.isPending}>
                {copy.submit}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
