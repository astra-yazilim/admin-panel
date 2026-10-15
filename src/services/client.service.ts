import { MOCK_CLIENTS, MOCK_SURVEYS } from '@/mock/clients.mock'
import type { Client, Project, Survey } from '@/types'
import { DB_TABLES } from '@/utils/validations/constants'
import { createRepository } from './http'

const clientRepository = createRepository<Client>(DB_TABLES.clients, MOCK_CLIENTS)
const surveyRepository = createRepository<Survey>(DB_TABLES.surveys, MOCK_SURVEYS)

export interface ClientContact {
  companyName: string
  fullName: string
  email: string
  phone: string
  website?: string
}

export const clientService = {
  list: () => clientRepository.list(),

  async createFromContact(contact: ClientContact) {
    const clients = await clientRepository.list()
    const existing = clients.find((client) => client.email === contact.email)
    if (existing) return existing
    return clientRepository.create({
      companyName: contact.companyName || contact.fullName,
      contactName: contact.fullName,
      email: contact.email,
      phone: contact.phone,
      website: contact.website ?? '',
      sector: '',
      city: '',
      status: 'active',
      createdAt: new Date().toISOString(),
    })
  },

  listSurveys: () => surveyRepository.list(),

  sendSurvey: (project: Project) =>
    surveyRepository.create({
      clientId: project.clientId,
      projectId: project.id,
      developerIds: project.assigneeIds,
      status: 'sent',
      sentAt: new Date().toISOString(),
    }),
}
