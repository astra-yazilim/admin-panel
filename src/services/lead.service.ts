import { MOCK_LEADS } from '@/mock/leads.mock'
import type { LeadFormValues } from '@/schemas/lead.schema'
import type { ProjectFormValues } from '@/schemas/project.schema'
import type { Lead, LeadStatus } from '@/types'
import { DB_TABLES, NEW_CLIENT_VALUE } from '@/utils/validations/constants'
import { clientService } from './client.service'
import { createRepository } from './http'
import { projectService } from './project.service'

const repository = createRepository<Lead>(DB_TABLES.leads, MOCK_LEADS)

export const leadService = {
  list: () => repository.list(),

  create: (values: LeadFormValues) =>
    repository.create({
      ...values,
      status: 'new',
      internalNote: '',
      createdAt: new Date().toISOString(),
    }),

  updateStatus: (id: string, status: LeadStatus) => repository.update(id, { status }),

  updateNote: (id: string, internalNote: string) => repository.update(id, { internalNote }),

  async convertToProject(lead: Lead, values: ProjectFormValues, authorName: string) {
    const clientId =
      values.clientId === NEW_CLIENT_VALUE ? (await clientService.createFromContact(lead)).id : values.clientId
    const project = await projectService.create({ ...values, clientId }, authorName, lead.id)
    await repository.update(lead.id, { status: 'accepted', convertedProjectId: project.id })
    return project
  },
}
