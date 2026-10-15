import type { ReactNode } from 'react'
import { Navigate, Outlet, useLocation } from 'react-router-dom'
import { AccessDenied } from '@/components/common/access-denied/access-denied'
import { useAuth } from '@/hooks/use-auth'
import { PERMISSIONS, type Permission } from '@/types'
import { ROUTE_PATHS } from '@/utils/validations/constants'
import { getMenuForPermissions } from './menu'

interface ProtectedRouteProps {
  permission?: Permission
  children?: ReactNode
}

export function ProtectedRoute({ permission, children }: ProtectedRouteProps) {
  const { isAuthenticated, can } = useAuth()
  const location = useLocation()

  if (!isAuthenticated) return <Navigate to={ROUTE_PATHS.login} replace state={{ from: location.pathname }} />
  if (permission && !can(permission)) return <AccessDenied />
  return children ?? <Outlet />
}

export function GuestRoute() {
  const { isAuthenticated } = useAuth()
  return isAuthenticated ? <Navigate to={ROUTE_PATHS.dashboard} replace /> : <Outlet />
}

export function HomeRoute({ children }: { children: ReactNode }) {
  const { can } = useAuth()
  if (can(PERMISSIONS.DASHBOARD_VIEW)) return children
  const firstPath = getMenuForPermissions(can).at(0)?.items.at(0)?.path ?? ROUTE_PATHS.settings
  return <Navigate to={firstPath} replace />
}
