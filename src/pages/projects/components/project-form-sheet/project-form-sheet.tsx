import { zodResolver } from '@hookform/resolvers/zod'
import { Loader2 } from 'lucide-react'
import { useEffect } from 'react'
import { useForm, type Control, type FieldPath } from 'react-hook-form'
import { SelectField } from '@/components/common/select-field/select-field'
import { Button } from '@/components/ui/button'
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Sheet, SheetContent, SheetDescription, SheetFooter, SheetHeader, SheetTitle } from '@/components/ui/sheet'
import { Textarea } from '@/components/ui/textarea'
import { useClients } from '@/hooks/use-clients'
import { useDevelopers } from '@/hooks/use-developers'
import { useConvertLead } from '@/hooks/use-leads'
import { useConvertSubmission } from '@/hooks/use-project-submissions'
import { useCreateProject, useUpdateProject } from '@/hooks/use-projects'
import { projectSchema, type ProjectFormValues } from '@/schemas/project.schema'
import type { Lead, Option, Project, ProjectSubmission } from '@/types'
import {
  NEW_CLIENT_VALUE,
  OWNER_TYPE_CONFIG,
  PRIORITY_CONFIG,
  PROJECT_CATEGORY_LABELS,
  SENIORITY_LABELS,
} from '@/utils/validations/constants'
import { toOptions, toStatusOptions } from '@/utils/validations/helpers'
import { messages } from '@/utils/validations/messages'
import { AssigneePicker } from '../assignee-picker/assignee-picker'
import { getProjectFormDefaults } from './project-form-defaults'
import styles from './project-form-sheet.module.css'

const { fields, placeholders } = messages.projects

const CATEGORY_OPTIONS = toOptions(PROJECT_CATEGORY_LABELS)
const PRIORITY_OPTIONS = toStatusOptions(PRIORITY_CONFIG)
const OWNER_OPTIONS = toStatusOptions(OWNER_TYPE_CONFIG)
const SENIORITY_OPTIONS = toOptions(SENIORITY_LABELS)

interface ProjectFormSheetProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  project?: Project
  lead?: Lead
  submission?: ProjectSubmission
  onSaved?: (project: Project) => void
}

interface SelectFormFieldProps {
  control: Control<ProjectFormValues>
  name: FieldPath<ProjectFormValues>
  label: string
  options: Option[]
}

function SelectFormField({ control, name, label, options }: SelectFormFieldProps) {
  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem>
          <FormLabel>{label}</FormLabel>
          <FormControl>
            <SelectField value={field.value as string} onValueChange={field.onChange} options={options} />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  )
}

export function ProjectFormSheet({ open, onOpenChange, project, lead, submission, onSaved }: ProjectFormSheetProps) {
  const { data: clients = [] } = useClients()
  const { data: developers = [] } = useDevelopers()
  const createProject = useCreateProject()
  const updateProject = useUpdateProject()
  const convertLead = useConvertLead()
  const convertSubmission = useConvertSubmission()
  const isPending =
    createProject.isPending || updateProject.isPending || convertLead.isPending || convertSubmission.isPending
  const newClientName = submission
    ? (submission.referral?.companyName ?? (submission.companyName || submission.fullName))
    : lead && (lead.companyName || lead.fullName)

  const form = useForm<ProjectFormValues>({
    resolver: zodResolver(projectSchema),
    defaultValues: getProjectFormDefaults({ project, lead, submission }),
  })

  useEffect(() => {
    if (open) form.reset(getProjectFormDefaults({ project, lead, submission }))
  }, [open, project, lead, submission, form])

  const clientOptions: Option[] = [
    ...(newClientName ? [{ value: NEW_CLIENT_VALUE, label: messages.projects.newClientOption(newClientName) }] : []),
    ...clients.map((client) => ({ value: client.id, label: client.companyName })),
  ]

  const title = project
    ? messages.projects.editProject
    : lead || submission
      ? messages.projects.convertTitle
      : messages.projects.newProject

  const onSubmit = (values: ProjectFormValues) => {
    const onSuccess = (saved: Project) => {
      onOpenChange(false)
      onSaved?.(saved)
    }
    if (project) updateProject.mutate({ id: project.id, values }, { onSuccess })
    else if (lead) convertLead.mutate({ lead, values }, { onSuccess })
    else if (submission) convertSubmission.mutate({ submission, values }, { onSuccess })
    else createProject.mutate(values, { onSuccess })
  }

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className={styles.content}>
        <SheetHeader className={styles.header}>
          <SheetTitle>{title}</SheetTitle>
          <SheetDescription>{project?.code ?? submission?.code ?? lead?.email ?? messages.projects.description}</SheetDescription>
        </SheetHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className={styles.form} noValidate>
            <div className={styles.body}>
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{fields.title}</FormLabel>
                    <FormControl>
                      <Input placeholder={placeholders.title} {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <SelectFormField control={form.control} name="clientId" label={fields.client} options={clientOptions} />
              <div className={styles.row}>
                <SelectFormField control={form.control} name="category" label={fields.category} options={CATEGORY_OPTIONS} />
                <SelectFormField control={form.control} name="priority" label={fields.priority} options={PRIORITY_OPTIONS} />
              </div>
              <div className={styles.row}>
                <SelectFormField control={form.control} name="ownerType" label={fields.ownerType} options={OWNER_OPTIONS} />
                <SelectFormField
                  control={form.control}
                  name="assigneeLevel"
                  label={fields.assigneeLevel}
                  options={SENIORITY_OPTIONS}
                />
              </div>
              <FormField
                control={form.control}
                name="assigneeIds"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{fields.assignees}</FormLabel>
                    <AssigneePicker developers={developers} value={field.value} onChange={field.onChange} />
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className={styles.row}>
                <FormField
                  control={form.control}
                  name="startDate"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{fields.startDate}</FormLabel>
                      <FormControl>
                        <Input type="date" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="dueDate"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{fields.dueDate}</FormLabel>
                      <FormControl>
                        <Input type="date" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{fields.description}</FormLabel>
                    <FormControl>
                      <Textarea rows={3} placeholder={placeholders.description} {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="problemStatement"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{fields.problemStatement}</FormLabel>
                    <FormControl>
                      <Textarea rows={2} placeholder={placeholders.problemStatement} {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className={styles.row}>
                <FormField
                  control={form.control}
                  name="repositoryUrl"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{fields.repositoryUrl}</FormLabel>
                      <FormControl>
                        <Input placeholder={placeholders.repositoryUrl} {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="branch"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{fields.branch}</FormLabel>
                      <FormControl>
                        <Input placeholder={placeholders.branch} {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <FormField
                control={form.control}
                name="tags"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{fields.tags}</FormLabel>
                    <FormControl>
                      <Input placeholder={placeholders.tags} {...field} />
                    </FormControl>
                    <FormDescription>{messages.projects.tagsHint}</FormDescription>
                  </FormItem>
                )}
              />
            </div>
            <SheetFooter className={styles.footer}>
              <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                {messages.common.cancel}
              </Button>
              <Button type="submit" disabled={isPending}>
                {isPending && <Loader2 className={styles.spinner} />}
                {project ? messages.common.save : messages.common.create}
              </Button>
            </SheetFooter>
          </form>
        </Form>
      </SheetContent>
    </Sheet>
  )
}
