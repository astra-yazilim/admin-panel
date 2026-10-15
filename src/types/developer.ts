import type { SeniorityLevel } from './common'

export type DeveloperType = 'core' | 'network'

export type ExpertiseArea =
  | 'ikas'
  | 'ticimax'
  | 'shopify'
  | 'woocommerce'
  | 'marketplace'
  | 'frontend'
  | 'backend'
  | 'mobile'
  | 'ai_automation'
  | 'ui_ux'
  | 'seo_performance'
  | 'devops_cloud'

export type ExperienceRange = '0_1' | '1_3' | '3_5' | '5_8' | '8_plus'

export type WorkModel = 'fixed_price' | 'weekly' | 'monthly'

export type WeeklyAvailability = 'under_10' | '10_20' | '20_30' | 'full_time'

export type ApplicationStatus = 'received' | 'reviewing' | 'interview' | 'approved' | 'rejected'

export type TrainingStatus = 'assigned' | 'in_progress' | 'completed'

export type TrainingSource = 'client_feedback' | 'internal_review'

export interface Developer {
  id: string
  fullName: string
  email: string
  phone: string
  city: string
  title: string
  type: DeveloperType
  seniority: SeniorityLevel
  expertiseAreas: ExpertiseArea[]
  techStack: string[]
  githubUrl: string
  linkedinUrl: string
  completedTasks: number
  isAvailable: boolean
  applicationId?: string
  joinedAt: string
}

export interface CvFile {
  fileName: string
  fileSize: number
  url: string
}

export interface DeveloperApplication {
  id: string
  fullName: string
  email: string
  phone: string
  city: string
  title: string
  experience: ExperienceRange
  expertiseAreas: ExpertiseArea[]
  otherTechnologies: string
  linkedinUrl: string
  githubUrl: string
  portfolioUrl: string
  cv: CvFile
  workModels: WorkModel[]
  weeklyAvailability: WeeklyAvailability
  expectedRate: string
  about: string
  privacyConsent: boolean
  agreementConsent: boolean
  status: ApplicationStatus
  interviewAt?: string
  reviewerNote: string
  createdAt: string
}

export interface TrainingModule {
  id: string
  title: string
  description: string
  targetLevel: SeniorityLevel
  durationHours: number
}

export interface TrainingAssignment {
  id: string
  developerId: string
  moduleId: string
  skillGap: string
  source: TrainingSource
  status: TrainingStatus
  assignedAt: string
}

export interface DeveloperPerformance {
  averageRating: number
  reviewCount: number
  performanceIndex: number
}
