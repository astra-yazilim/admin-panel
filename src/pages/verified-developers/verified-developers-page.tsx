import { PageHeader } from '@/components/common/page-header/page-header'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { messages } from '@/utils/validations/messages'
import { AcademyPanel } from './components/academy-panel/academy-panel'
import { ApplicationPipeline } from './components/application-pipeline/application-pipeline'
import { DeveloperNetwork } from './components/developer-network/developer-network'
import styles from './verified-developers-page.module.css'

const { tabs } = messages.developers

export default function VerifiedDevelopersPage() {
  return (
    <>
      <PageHeader title={messages.developers.title} description={messages.developers.description} />
      <Tabs defaultValue="network" className={styles.tabs}>
        <TabsList>
          <TabsTrigger value="network">{tabs.network}</TabsTrigger>
          <TabsTrigger value="applications">{tabs.applications}</TabsTrigger>
          <TabsTrigger value="academy">{tabs.academy}</TabsTrigger>
        </TabsList>
        <TabsContent value="network">
          <DeveloperNetwork />
        </TabsContent>
        <TabsContent value="applications">
          <ApplicationPipeline />
        </TabsContent>
        <TabsContent value="academy">
          <AcademyPanel />
        </TabsContent>
      </Tabs>
    </>
  )
}
