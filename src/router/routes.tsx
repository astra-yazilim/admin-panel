import { FileQuestion } from 'lucide-react'
import { lazy } from 'react'
import type { RouteObject } from 'react-router-dom'
import { EmptyState } from '@/components/common/empty-state/empty-state'
import { AppLayout } from '@/components/layout/app-layout/app-layout'
import { AuthLayout } from '@/components/layout/auth-layout/auth-layout'
import { PERMISSIONS } from '@/types'
import { ROUTE_PATHS } from '@/utils/validations/constants'
import { messages } from '@/utils/validations/messages'
import { GuestRoute, HomeRoute, ProtectedRoute } from './protected-route'

const LoginPage = lazy(() => import('@/pages/auth/login-page'))
const ForgotPasswordPage = lazy(() => import('@/pages/auth/forgot-password-page'))
const DashboardPage = lazy(() => import('@/pages/dashboard/dashboard-page'))
const LeadRequestsPage = lazy(() => import('@/pages/lead-requests/lead-requests-page'))
const ProjectsPage = lazy(() => import('@/pages/projects/projects-page'))
const ProjectDetailPage = lazy(() => import('@/pages/projects/project-detail-page'))
const VerifiedDevelopersPage = lazy(() => import('@/pages/verified-developers/verified-developers-page'))
const ClientsPage = lazy(() => import('@/pages/clients/clients-page'))
const FinancePage = lazy(() => import('@/pages/finance/finance-page'))
const SettingsPage = lazy(() => import('@/pages/settings/settings-page'))
const ProjectSubmissionsPage = lazy(() => import('@/pages/project-submissions/project-submissions-page'))
const InvestorsPage = lazy(() => import('@/pages/investors/investors-page'))
const OpportunitiesPage = lazy(() => import('@/pages/opportunities/opportunities-page'))

const notFound = (
  <EmptyState
    icon={FileQuestion}
    title={messages.errors.pageNotFoundTitle}
    description={messages.errors.pageNotFoundDescription}
  />
)

export const routes: RouteObject[] = [
  {
    element: <GuestRoute />,
    children: [
      {
        element: <AuthLayout />,
        children: [
          { path: ROUTE_PATHS.login, element: <LoginPage /> },
          { path: ROUTE_PATHS.forgotPassword, element: <ForgotPasswordPage /> },
        ],
      },
    ],
  },
  {
    element: <ProtectedRoute />,
    children: [
      {
        element: <AppLayout />,
        children: [
          {
            index: true,
            element: (
              <HomeRoute>
                <DashboardPage />
              </HomeRoute>
            ),
          },
          {
            path: ROUTE_PATHS.leadRequests,
            element: (
              <ProtectedRoute permission={PERMISSIONS.LEADS_VIEW}>
                <LeadRequestsPage />
              </ProtectedRoute>
            ),
          },
          {
            path: ROUTE_PATHS.projectSubmissions,
            element: (
              <ProtectedRoute permission={PERMISSIONS.SUBMISSIONS_VIEW}>
                <ProjectSubmissionsPage />
              </ProtectedRoute>
            ),
          },
          {
            path: ROUTE_PATHS.investors,
            element: (
              <ProtectedRoute permission={PERMISSIONS.INVESTORS_VIEW}>
                <InvestorsPage />
              </ProtectedRoute>
            ),
          },
          {
            path: ROUTE_PATHS.opportunities,
            element: (
              <ProtectedRoute permission={PERMISSIONS.OPPORTUNITIES_BROWSE}>
                <OpportunitiesPage />
              </ProtectedRoute>
            ),
          },
          {
            path: ROUTE_PATHS.projects,
            element: (
              <ProtectedRoute permission={PERMISSIONS.PROJECTS_VIEW}>
                <ProjectsPage />
              </ProtectedRoute>
            ),
          },
          {
            path: ROUTE_PATHS.projectDetail,
            element: (
              <ProtectedRoute permission={PERMISSIONS.PROJECTS_VIEW}>
                <ProjectDetailPage />
              </ProtectedRoute>
            ),
          },
          {
            path: ROUTE_PATHS.verifiedDevelopers,
            element: (
              <ProtectedRoute permission={PERMISSIONS.DEVELOPERS_VIEW}>
                <VerifiedDevelopersPage />
              </ProtectedRoute>
            ),
          },
          {
            path: ROUTE_PATHS.clients,
            element: (
              <ProtectedRoute permission={PERMISSIONS.CLIENTS_VIEW}>
                <ClientsPage />
              </ProtectedRoute>
            ),
          },
          {
            path: ROUTE_PATHS.finance,
            element: (
              <ProtectedRoute permission={PERMISSIONS.FINANCE_VIEW}>
                <FinancePage />
              </ProtectedRoute>
            ),
          },
          {
            path: ROUTE_PATHS.settings,
            element: (
              <ProtectedRoute permission={PERMISSIONS.SETTINGS_VIEW}>
                <SettingsPage />
              </ProtectedRoute>
            ),
          },
          { path: '*', element: notFound },
        ],
      },
    ],
  },
]
