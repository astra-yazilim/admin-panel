import { Building2, Inbox } from 'lucide-react'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { EmptyState } from '@/components/common/empty-state/empty-state'
import { PageHeader } from '@/components/common/page-header/page-header'
import { SearchInput } from '@/components/common/search-input/search-input'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { useAuth } from '@/hooks/use-auth'
import { useClients, useSurveys } from '@/hooks/use-clients'
import { useDevelopers } from '@/hooks/use-developers'
import { useEntityMap } from '@/hooks/use-entity-map'
import { useLeads } from '@/hooks/use-leads'
import { useProjects } from '@/hooks/use-projects'
import { LeadTable } from '@/pages/lead-requests/components/lead-table/lead-table'
import { PERMISSIONS } from '@/types'
import { OPEN_LEAD_STATUSES, ROUTE_PATHS } from '@/utils/validations/constants'
import { matchesSearch } from '@/utils/validations/helpers'
import { messages } from '@/utils/validations/messages'
import { ClientDetailSheet } from './components/client-detail-sheet/client-detail-sheet'
import { ClientTable } from './components/client-table/client-table'
import { SurveyResults } from './components/survey-results/survey-results'
import styles from './clients-page.module.css'

const { tabs } = messages.clients

export default function ClientsPage() {
  const { can } = useAuth()
  const navigate = useNavigate()
  const { data: clients = [] } = useClients()
  const { data: projects = [] } = useProjects()
  const { data: surveys = [] } = useSurveys()
  const { data: leads = [] } = useLeads()
  const { data: developers } = useDevelopers()
  const projectMap = useEntityMap(projects)
  const clientMap = useEntityMap(clients)
  const developerMap = useEntityMap(developers)
  const [search, setSearch] = useState('')
  const [selectedId, setSelectedId] = useState<string>()

  const filteredClients = clients.filter((client) =>
    matchesSearch(search, client.companyName, client.contactName, client.sector),
  )
  const openLeads = leads.filter((lead) => OPEN_LEAD_STATUSES.includes(lead.status))

  return (
    <>
      <PageHeader title={messages.clients.title} description={messages.clients.description} />
      <Tabs defaultValue="active" className={styles.tabs}>
        <TabsList>
          <TabsTrigger value="active">{tabs.active}</TabsTrigger>
          <TabsTrigger value="inquiries">{tabs.inquiries}</TabsTrigger>
          <TabsTrigger value="surveys">{tabs.surveys}</TabsTrigger>
        </TabsList>

        <TabsContent value="active" className={styles.panel}>
          <SearchInput value={search} onChange={setSearch} placeholder={messages.clients.searchPlaceholder} />
          {filteredClients.length === 0 ? (
            <EmptyState icon={Building2} title={messages.clients.empty} />
          ) : (
            <ClientTable
              clients={filteredClients}
              projects={projects}
              surveys={surveys}
              showContact={can(PERMISSIONS.CLIENTS_CONTACT_VIEW)}
              onSelect={(client) => setSelectedId(client.id)}
            />
          )}
        </TabsContent>

        <TabsContent value="inquiries" className={styles.panel}>
          <p className={styles.hint}>{messages.clients.inquiriesHint}</p>
          {openLeads.length === 0 ? (
            <EmptyState icon={Inbox} title={messages.clients.inquiriesEmpty} />
          ) : (
            <LeadTable leads={openLeads} onSelect={() => navigate(ROUTE_PATHS.leadRequests)} />
          )}
        </TabsContent>

        <TabsContent value="surveys" className={styles.panel}>
          <SurveyResults surveys={surveys} projects={projectMap} clients={clientMap} developers={developerMap} />
        </TabsContent>
      </Tabs>

      <ClientDetailSheet
        client={clients.find((client) => client.id === selectedId)}
        projects={projects}
        surveys={surveys}
        onOpenChange={(open) => !open && setSelectedId(undefined)}
      />
    </>
  )
}
