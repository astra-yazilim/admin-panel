import { ExternalLink } from 'lucide-react'
import { PageHeader } from '@/components/common/page-header/page-header'
import { Button } from '@/components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { useAuth } from '@/hooks/use-auth'
import { PERMISSIONS } from '@/types'
import { LANDING_LINKS } from '@/utils/validations/constants'
import { messages } from '@/utils/validations/messages'
import { InterestTable } from './components/interest-table/interest-table'
import { InvestorPipeline } from './components/investor-pipeline/investor-pipeline'
import { OpportunityBoard } from './components/opportunity-board/opportunity-board'
import styles from './investors-page.module.css'

const { tabs } = messages.investors

export default function InvestorsPage() {
  const { can } = useAuth()
  const canManageOpportunities = can(PERMISSIONS.OPPORTUNITIES_MANAGE)

  return (
    <>
      <PageHeader
        title={messages.investors.title}
        description={messages.investors.description}
        actions={
          <Button asChild variant="outline">
            <a href={LANDING_LINKS.investorApplication} target="_blank" rel="noreferrer">
              <ExternalLink />
              {messages.investors.publicFormLink}
            </a>
          </Button>
        }
      />
      <Tabs defaultValue="applications" className={styles.tabs}>
        <TabsList>
          <TabsTrigger value="applications">{tabs.applications}</TabsTrigger>
          {canManageOpportunities && <TabsTrigger value="opportunities">{tabs.opportunities}</TabsTrigger>}
          {canManageOpportunities && <TabsTrigger value="interests">{tabs.interests}</TabsTrigger>}
        </TabsList>
        <TabsContent value="applications">
          <InvestorPipeline />
        </TabsContent>
        {canManageOpportunities && (
          <>
            <TabsContent value="opportunities">
              <OpportunityBoard />
            </TabsContent>
            <TabsContent value="interests">
              <InterestTable />
            </TabsContent>
          </>
        )}
      </Tabs>
    </>
  )
}
