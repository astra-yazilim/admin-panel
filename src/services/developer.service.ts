import {
  MOCK_APPLICATIONS,
  MOCK_DEVELOPERS,
  MOCK_TRAINING_ASSIGNMENTS,
  MOCK_TRAINING_MODULES,
} from '@/mock/developers.mock'
import type {
  ApplicationStatus,
  Developer,
  DeveloperApplication,
  SeniorityLevel,
  TrainingAssignment,
  TrainingModule,
  TrainingStatus,
} from '@/types'
import { DB_TABLES } from '@/utils/validations/constants'
import { createRepository } from './http'

const developerRepository = createRepository<Developer>(DB_TABLES.developers, MOCK_DEVELOPERS)
const applicationRepository = createRepository<DeveloperApplication>(DB_TABLES.applications, MOCK_APPLICATIONS)
const moduleRepository = createRepository<TrainingModule>(DB_TABLES.trainingModules, MOCK_TRAINING_MODULES)
const assignmentRepository = createRepository<TrainingAssignment>(
  DB_TABLES.trainingAssignments,
  MOCK_TRAINING_ASSIGNMENTS,
)

export interface ApplicationUpdate {
  status: ApplicationStatus
  reviewerNote: string
  interviewAt?: string
}

export const developerService = {
  listDevelopers: () => developerRepository.list(),

  listApplications: () => applicationRepository.list(),

  updateApplication: (id: string, update: ApplicationUpdate) => applicationRepository.update(id, update),

  async approveApplication(application: DeveloperApplication, seniority: SeniorityLevel, reviewerNote: string) {
    const developer = await developerRepository.create({
      fullName: application.fullName,
      email: application.email,
      phone: application.phone,
      city: application.city,
      title: application.title,
      type: 'network',
      seniority,
      expertiseAreas: application.expertiseAreas,
      techStack: application.otherTechnologies
        .split(',')
        .map((technology) => technology.trim())
        .filter(Boolean),
      githubUrl: application.githubUrl,
      linkedinUrl: application.linkedinUrl,
      completedTasks: 0,
      isAvailable: true,
      applicationId: application.id,
      joinedAt: new Date().toISOString(),
    })
    await applicationRepository.update(application.id, { status: 'approved', reviewerNote })
    return developer
  },

  listTrainingModules: () => moduleRepository.list(),

  listTrainingAssignments: () => assignmentRepository.list(),

  updateTrainingStatus: (id: string, status: TrainingStatus) => assignmentRepository.update(id, { status }),
}
