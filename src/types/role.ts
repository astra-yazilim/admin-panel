export const ROLES = {
  SUPER_ADMIN: 'super_admin',
  MANAGER: 'manager',
  CORE_DEVELOPER: 'core_developer',
  VERIFIED_DEVELOPER: 'verified_developer',
  CONTENT_MANAGER: 'content_manager',
  INVESTOR: 'investor',
} as const

export type Role = (typeof ROLES)[keyof typeof ROLES]

export const PERMISSIONS = {
  DASHBOARD_VIEW: 'dashboard:view',
  LEADS_VIEW: 'leads:view',
  LEADS_WRITE: 'leads:write',
  PROJECTS_VIEW: 'projects:view',
  PROJECTS_VIEW_ALL: 'projects:view_all',
  PROJECTS_WRITE: 'projects:write',
  PROJECTS_MOVE: 'projects:move',
  DEVELOPERS_VIEW: 'developers:view',
  DEVELOPERS_APPROVE: 'developers:approve',
  ACADEMY_MANAGE: 'academy:manage',
  CLIENTS_VIEW: 'clients:view',
  CLIENTS_CONTACT_VIEW: 'clients:contact_view',
  SURVEYS_SEND: 'surveys:send',
  FINANCE_VIEW: 'finance:view',
  FINANCE_PAYOUTS_VIEW: 'finance:payouts_view',
  FINANCE_WRITE: 'finance:write',
  SUBMISSIONS_VIEW: 'submissions:view',
  SUBMISSIONS_REVIEW: 'submissions:review',
  INVESTORS_VIEW: 'investors:view',
  INVESTORS_APPROVE: 'investors:approve',
  OPPORTUNITIES_MANAGE: 'opportunities:manage',
  OPPORTUNITIES_BROWSE: 'opportunities:browse',
  SETTINGS_VIEW: 'settings:view',
  SETTINGS_MANAGE: 'settings:manage',
} as const

export type Permission = (typeof PERMISSIONS)[keyof typeof PERMISSIONS]
