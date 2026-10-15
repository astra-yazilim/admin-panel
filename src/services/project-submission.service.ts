import { MOCK_SUBMISSIONS } from '@/mock/project-submissions.mock'
import type { ProjectFormValues } from '@/schemas/project.schema'
import type { ProjectSubmission, SubmissionStatus } from '@/types'
import { DB_TABLES, NEW_CLIENT_VALUE } from '@/utils/validations/constants'
import { clientService } from './client.service'
import { createRepository } from './http'
import { projectService } from './project.service'

const repository = createRepository<ProjectSubmission>(DB_TABLES.submissions, MOCK_SUBMISSIONS)

export interface SubmissionReview {
  status: SubmissionStatus
  reviewerNote: string
}

export const projectSubmissionService = {
  list: () => repository.list(),

  updateReview: (id: string, review: SubmissionReview) => repository.update(id, review),

  linkOpportunity: (id: string, opportunityId: string) => repository.update(id, { opportunityId }),

  async convertToProject(submission: ProjectSubmission, values: ProjectFormValues, authorName: string) {
    const contact = submission.referral
      ? {
          companyName: submission.referral.companyName,
          fullName: submission.referral.contactName,
          email: submission.referral.contactEmail,
          phone: '',
        }
      : submission
    const clientId =
      values.clientId === NEW_CLIENT_VALUE ? (await clientService.createFromContact(contact)).id : values.clientId
    const project = await projectService.create({ ...values, clientId }, authorName)
    await repository.update(submission.id, { status: 'approved', convertedProjectId: project.id })
    return project
  },
}
