import { ShieldAlert } from 'lucide-react'
import { Link } from 'react-router-dom'
import { EmptyState } from '@/components/common/empty-state/empty-state'
import { Button } from '@/components/ui/button'
import { ROUTE_PATHS } from '@/utils/validations/constants'
import { messages } from '@/utils/validations/messages'

export function AccessDenied() {
  return (
    <EmptyState
      icon={ShieldAlert}
      title={messages.errors.accessDeniedTitle}
      description={messages.errors.accessDeniedDescription}
      action={
        <Button asChild variant="outline" size="sm">
          <Link to={ROUTE_PATHS.dashboard}>{messages.errors.backToDashboard}</Link>
        </Button>
      }
    />
  )
}
