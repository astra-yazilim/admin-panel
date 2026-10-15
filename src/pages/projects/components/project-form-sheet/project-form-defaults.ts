import type { ProjectFormValues } from '@/schemas/project.schema'
import type { Lead, Project, ProjectSubmission } from '@/types'
import {
  NEW_CLIENT_VALUE,
  PRODUCT_TYPE_CATEGORY_MAP,
  SERVICE_CATEGORY_MAP,
  SERVICE_LABELS,
} from '@/utils/validations/constants'
import { toDateInputValue } from '@/utils/validations/formatters'

const DEFAULT_DURATION_DAYS = 30

const today = () => new Date().toISOString()
const daysFromNow = (days: number) => new Date(Date.now() + days * 86_400_000).toISOString()

export interface ProjectFormSource {
  project?: Project
  lead?: Lead
  submission?: ProjectSubmission
}

const emptyDefaults = (): ProjectFormValues => ({
  title: '',
  description: '',
  problemStatement: '',
  clientId: '',
  category: 'micro_task',
  priority: 'medium',
  ownerType: 'developer_network',
  assigneeLevel: 'mid',
  assigneeIds: [],
  startDate: toDateInputValue(today()),
  dueDate: toDateInputValue(daysFromNow(DEFAULT_DURATION_DAYS)),
  repositoryUrl: '',
  branch: 'main',
  tags: '',
})

export function getProjectFormDefaults({ project, lead, submission }: ProjectFormSource): ProjectFormValues {
  if (project) {
    return {
      title: project.title,
      description: project.description,
      problemStatement: project.problemStatement,
      clientId: project.clientId,
      category: project.category,
      priority: project.priority,
      ownerType: project.ownerType,
      assigneeLevel: project.assigneeLevel,
      assigneeIds: project.assigneeIds,
      startDate: toDateInputValue(project.startDate),
      dueDate: toDateInputValue(project.dueDate),
      repositoryUrl: project.github.repositoryUrl,
      branch: project.github.branch,
      tags: project.tags.join(', '),
    }
  }

  if (submission) {
    return {
      ...emptyDefaults(),
      title: submission.projectName,
      description: submission.summary,
      problemStatement: [submission.problem, submission.stallReason].filter(Boolean).join('\n\n'),
      clientId: NEW_CLIENT_VALUE,
      category: PRODUCT_TYPE_CATEGORY_MAP[submission.productType],
      repositoryUrl: submission.repositoryUrl.startsWith('http') ? submission.repositoryUrl : '',
      tags: submission.techStack,
    }
  }

  if (lead) {
    return {
      ...emptyDefaults(),
      title: `${lead.companyName || lead.fullName} – ${SERVICE_LABELS[lead.service]}`,
      description: lead.message,
      problemStatement: lead.internalNote,
      clientId: NEW_CLIENT_VALUE,
      category: SERVICE_CATEGORY_MAP[lead.service],
    }
  }

  return emptyDefaults()
}
