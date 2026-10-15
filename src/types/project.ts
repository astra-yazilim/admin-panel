import type { Priority, SeniorityLevel } from './common'

export type ProjectStatus = 'backlog' | 'in_progress' | 'testing' | 'uat' | 'live'

export type ProjectCategory =
  | 'core_product'
  | 'custom_web'
  | 'ecommerce_integration'
  | 'mobile_app'
  | 'ui_ux'
  | 'micro_task'

export type OwnerType = 'core_team' | 'developer_network'

export type BranchStatus = 'up_to_date' | 'ahead' | 'behind' | 'conflict'

export type CiStatus = 'passing' | 'failing' | 'running' | 'none'

export type ActivityType = 'note' | 'status_change' | 'assignment' | 'created'

export interface GithubInfo {
  repositoryUrl: string
  organizationUrl: string
  branch: string
  branchStatus: BranchStatus
  ciStatus: CiStatus
  ciNotes: string
}

export interface ActivityEntry {
  id: string
  type: ActivityType
  authorName: string
  message: string
  createdAt: string
}

export interface Project {
  id: string
  code: string
  title: string
  description: string
  problemStatement: string
  clientId: string
  leadId?: string
  category: ProjectCategory
  status: ProjectStatus
  priority: Priority
  ownerType: OwnerType
  assigneeIds: string[]
  assigneeLevel: SeniorityLevel
  startDate: string
  dueDate: string
  progress: number
  tags: string[]
  github: GithubInfo
  activity: ActivityEntry[]
  createdAt: string
}
