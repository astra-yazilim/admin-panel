import { MOCK_PROJECTS } from '@/mock/projects.mock'
import type { ProjectFormValues } from '@/schemas/project.schema'
import type { ActivityEntry, ActivityType, Project, ProjectStatus } from '@/types'
import { DB_TABLES, PROJECT_STATUS_CONFIG } from '@/utils/validations/constants'
import { messages } from '@/utils/validations/messages'
import { createRepository } from './http'

const repository = createRepository<Project>(DB_TABLES.projects, MOCK_PROJECTS)

const CODE_PREFIX = 'AST-'
const ORGANIZATION_URL = 'https://github.com/astra-yazilim'

export interface ProjectListFilter {
  assigneeId?: string
}

const createActivity = (type: ActivityType, authorName: string, message: string): ActivityEntry => ({
  id: crypto.randomUUID(),
  type,
  authorName,
  message,
  createdAt: new Date().toISOString(),
})

const parseTags = (tags: string) =>
  tags
    .split(',')
    .map((tag) => tag.trim())
    .filter(Boolean)

const toIsoDate = (date: string) => new Date(`${date}T09:00:00`).toISOString()

const nextCode = (projects: Project[]) => {
  const numbers = projects.map((project) => Number(project.code.replace(CODE_PREFIX, '')) || 0)
  return `${CODE_PREFIX}${Math.max(100, ...numbers) + 1}`
}

const fromFormValues = (values: ProjectFormValues) => ({
  title: values.title,
  description: values.description,
  problemStatement: values.problemStatement,
  clientId: values.clientId,
  category: values.category,
  priority: values.priority,
  ownerType: values.ownerType,
  assigneeIds: values.assigneeIds,
  assigneeLevel: values.assigneeLevel,
  startDate: toIsoDate(values.startDate),
  dueDate: toIsoDate(values.dueDate),
  tags: parseTags(values.tags),
})

export const projectService = {
  async list(filter: ProjectListFilter = {}) {
    const projects = await repository.list()
    const { assigneeId } = filter
    if (assigneeId === undefined) return projects
    return projects.filter((project) => project.assigneeIds.includes(assigneeId))
  },

  getById: (id: string) => repository.getById(id),

  async create(values: ProjectFormValues, authorName: string, leadId?: string) {
    const projects = await repository.list()
    const now = new Date().toISOString()
    return repository.create({
      ...fromFormValues(values),
      code: nextCode(projects),
      leadId,
      status: 'backlog',
      progress: 0,
      github: {
        repositoryUrl: values.repositoryUrl,
        organizationUrl: ORGANIZATION_URL,
        branch: values.branch,
        branchStatus: 'up_to_date',
        ciStatus: 'none',
        ciNotes: '',
      },
      activity: [
        createActivity('created', authorName, leadId ? messages.activity.createdFromLead : messages.activity.created),
      ],
      createdAt: now,
    })
  },

  async update(id: string, values: ProjectFormValues, authorName: string) {
    const project = await repository.getById(id)
    return repository.update(id, {
      ...fromFormValues(values),
      github: { ...project.github, repositoryUrl: values.repositoryUrl, branch: values.branch },
      activity: [createActivity('note', authorName, messages.activity.updated), ...project.activity],
    })
  },

  async move(id: string, status: ProjectStatus, authorName: string) {
    const project = await repository.getById(id)
    if (project.status === status) return project
    const message = messages.activity.statusChanged(
      PROJECT_STATUS_CONFIG[project.status].label,
      PROJECT_STATUS_CONFIG[status].label,
    )
    return repository.update(id, {
      status,
      progress: status === 'live' ? 100 : project.progress,
      activity: [createActivity('status_change', authorName, message), ...project.activity],
    })
  },

  async addNote(id: string, note: string, authorName: string) {
    const project = await repository.getById(id)
    return repository.update(id, {
      activity: [createActivity('note', authorName, note), ...project.activity],
    })
  },
}
