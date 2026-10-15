import { zodResolver } from '@hookform/resolvers/zod'
import { Loader2, ShieldAlert } from 'lucide-react'
import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import {
  NumberFormField,
  SelectFormField,
  TextareaFormField,
  TextFormField,
} from '@/components/common/form-fields/form-fields'
import { FormSection } from '@/components/common/form-section/form-section'
import { Button } from '@/components/ui/button'
import { Form } from '@/components/ui/form'
import { Sheet, SheetContent, SheetDescription, SheetFooter, SheetHeader, SheetTitle } from '@/components/ui/sheet'
import { useSaveOpportunity } from '@/hooks/use-opportunities'
import { useProjectSubmissions } from '@/hooks/use-project-submissions'
import { useProjects } from '@/hooks/use-projects'
import { opportunitySchema, type OpportunityFormValues } from '@/schemas/opportunity.schema'
import type { InvestmentOpportunity, ProjectSubmission } from '@/types'
import {
  INVESTMENT_MODEL_LABELS,
  INVESTMENT_STAGE_LABELS,
  NO_LINK_VALUE,
  OPPORTUNITY_SOURCE_LABELS,
  OPPORTUNITY_STATUS_CONFIG,
  SECTOR_LABELS,
} from '@/utils/validations/constants'
import { toOptions, toStatusOptions } from '@/utils/validations/helpers'
import { messages } from '@/utils/validations/messages'
import { getOpportunityFormDefaults } from './opportunity-form-defaults'
import styles from './opportunity-form-sheet.module.css'

const { opportunities: copy } = messages.investors
const { fields } = copy
const NONE_OPTION = { value: NO_LINK_VALUE, label: copy.none }

interface OpportunityFormSheetProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  opportunity?: InvestmentOpportunity
  submission?: ProjectSubmission
}

export function OpportunityFormSheet({ open, onOpenChange, opportunity, submission }: OpportunityFormSheetProps) {
  const saveOpportunity = useSaveOpportunity()
  const { data: projects = [] } = useProjects()
  const { data: submissions = [] } = useProjectSubmissions()
  const form = useForm<OpportunityFormValues>({
    resolver: zodResolver(opportunitySchema),
    defaultValues: getOpportunityFormDefaults(opportunity, submission),
  })
  const { control } = form
  const source = form.watch('source')

  useEffect(() => {
    if (open) form.reset(getOpportunityFormDefaults(opportunity, submission))
  }, [open, opportunity, submission, form])

  const onSubmit = (values: OpportunityFormValues) =>
    saveOpportunity.mutate({ id: opportunity?.id, values }, { onSuccess: () => onOpenChange(false) })

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className={styles.content}>
        <SheetHeader className={styles.header}>
          <SheetTitle>{opportunity ? copy.edit : copy.new}</SheetTitle>
          <SheetDescription>{opportunity?.code ?? submission?.code ?? messages.investors.description}</SheetDescription>
        </SheetHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className={styles.form} noValidate>
            <div className={styles.body}>
              <p className={styles.notice}>
                <ShieldAlert />
                {copy.confidentialHint}
              </p>
              <FormSection title={messages.opportunities.sections.summary}>
                <TextFormField control={control} name="title" label={fields.title} placeholder={copy.placeholders.title} required fullWidth />
                <TextFormField control={control} name="tagline" label={fields.tagline} required fullWidth />
                <SelectFormField control={control} name="sector" label={fields.sector} options={toOptions(SECTOR_LABELS)} required />
                <SelectFormField control={control} name="stage" label={fields.stage} options={toOptions(INVESTMENT_STAGE_LABELS)} required />
                <SelectFormField control={control} name="source" label={fields.source} options={toOptions(OPPORTUNITY_SOURCE_LABELS)} required />
                {source === 'project_submission' ? (
                  <SelectFormField
                    control={control}
                    name="submissionId"
                    label={fields.submissionId}
                    options={[NONE_OPTION, ...submissions.map((item) => ({ value: item.id, label: `${item.code} · ${item.projectName}` }))]}
                  />
                ) : (
                  <SelectFormField
                    control={control}
                    name="projectId"
                    label={fields.projectId}
                    options={[NONE_OPTION, ...projects.map((item) => ({ value: item.id, label: `${item.code} · ${item.title}` }))]}
                  />
                )}
                <TextareaFormField control={control} name="summary" label={fields.summary} rows={3} required />
                <TextareaFormField control={control} name="problem" label={fields.problem} rows={2} required />
                <TextareaFormField control={control} name="solution" label={fields.solution} rows={2} required />
                <TextFormField control={control} name="targetMarket" label={fields.targetMarket} required fullWidth />
                <TextFormField control={control} name="businessModel" label={fields.businessModel} required fullWidth />
                <TextareaFormField control={control} name="traction" label={fields.traction} rows={2} />
                <TextareaFormField control={control} name="useOfFunds" label={fields.useOfFunds} rows={2} />
                <TextareaFormField
                  control={control}
                  name="highlights"
                  label={fields.highlights}
                  placeholder={copy.placeholders.highlights}
                  description={copy.highlightsHint}
                  rows={3}
                />
              </FormSection>
              <FormSection title={messages.investors.tabs.opportunities}>
                <NumberFormField control={control} name="fundingTarget" label={fields.fundingTarget} required />
                <NumberFormField control={control} name="minimumTicket" label={fields.minimumTicket} required />
                <NumberFormField control={control} name="committedAmount" label={fields.committedAmount} />
                <SelectFormField
                  control={control}
                  name="investmentModel"
                  label={fields.investmentModel}
                  options={toOptions(INVESTMENT_MODEL_LABELS)}
                  required
                />
                <TextFormField control={control} name="estimatedTimeline" label={fields.estimatedTimeline} />
                <SelectFormField
                  control={control}
                  name="status"
                  label={fields.status}
                  options={toStatusOptions(OPPORTUNITY_STATUS_CONFIG)}
                  required
                />
                <TextareaFormField control={control} name="internalNote" label={fields.internalNote} rows={2} />
              </FormSection>
            </div>
            <SheetFooter className={styles.footer}>
              <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                {messages.common.cancel}
              </Button>
              <Button type="submit" disabled={saveOpportunity.isPending}>
                {saveOpportunity.isPending && <Loader2 className={styles.spinner} />}
                {messages.common.save}
              </Button>
            </SheetFooter>
          </form>
        </Form>
      </SheetContent>
    </Sheet>
  )
}
