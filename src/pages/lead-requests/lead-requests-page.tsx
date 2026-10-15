import { Inbox, Plus } from 'lucide-react'
import { useMemo, useState } from 'react'
import { EmptyState } from '@/components/common/empty-state/empty-state'
import { FilterTabs } from '@/components/common/filter-tabs/filter-tabs'
import { PageHeader } from '@/components/common/page-header/page-header'
import { PageLoader } from '@/components/common/page-loader/page-loader'
import { SearchInput } from '@/components/common/search-input/search-input'
import { Button } from '@/components/ui/button'
import { useAuth } from '@/hooks/use-auth'
import { useLeads } from '@/hooks/use-leads'
import { ProjectFormSheet } from '@/pages/projects/components/project-form-sheet/project-form-sheet'
import { PERMISSIONS, type Lead, type LeadStatus } from '@/types'
import { ALL_FILTER_VALUE, LEAD_STATUS_CONFIG, LEAD_STATUS_ORDER } from '@/utils/validations/constants'
import { buildFilterTabs, countBy, matchesSearch } from '@/utils/validations/helpers'
import { messages } from '@/utils/validations/messages'
import { LeadDetailSheet } from './components/lead-detail-sheet/lead-detail-sheet'
import { LeadFormDialog } from './components/lead-form-dialog/lead-form-dialog'
import { LeadTable } from './components/lead-table/lead-table'
import styles from './lead-requests-page.module.css'

type LeadStatusFilter = LeadStatus | typeof ALL_FILTER_VALUE

export default function LeadRequestsPage() {
  const { can } = useAuth()
  const { data: leads = [], isLoading } = useLeads()
  const [status, setStatus] = useState<LeadStatusFilter>(ALL_FILTER_VALUE)
  const [search, setSearch] = useState('')
  const [selectedId, setSelectedId] = useState<string>()
  const [convertingLead, setConvertingLead] = useState<Lead>()
  const [isFormOpen, setFormOpen] = useState(false)

  const tabs = useMemo(
    () => buildFilterTabs(messages.common.all, LEAD_STATUS_ORDER, LEAD_STATUS_CONFIG, countBy(leads, (lead) => lead.status)),
    [leads],
  )
  const filteredLeads = leads
    .filter((lead) => status === ALL_FILTER_VALUE || lead.status === status)
    .filter((lead) => matchesSearch(search, lead.fullName, lead.companyName, lead.email))
    .sort((a, b) => b.createdAt.localeCompare(a.createdAt))

  const startConversion = (lead: Lead) => {
    setSelectedId(undefined)
    setConvertingLead(lead)
  }

  return (
    <>
      <PageHeader
        title={messages.leads.title}
        description={messages.leads.description}
        actions={
          can(PERMISSIONS.LEADS_WRITE) && (
            <Button onClick={() => setFormOpen(true)}>
              <Plus />
              {messages.leads.newLead}
            </Button>
          )
        }
      />
      <div className={styles.toolbar}>
        <FilterTabs<LeadStatusFilter> tabs={tabs} value={status} onChange={setStatus} />
        <SearchInput value={search} onChange={setSearch} placeholder={messages.leads.searchPlaceholder} />
      </div>
      {isLoading ? (
        <PageLoader />
      ) : filteredLeads.length === 0 ? (
        <EmptyState icon={Inbox} title={messages.leads.empty} />
      ) : (
        <LeadTable leads={filteredLeads} onSelect={(lead) => setSelectedId(lead.id)} />
      )}
      <LeadDetailSheet
        lead={leads.find((lead) => lead.id === selectedId)}
        onOpenChange={(open) => !open && setSelectedId(undefined)}
        onConvert={startConversion}
      />
      <ProjectFormSheet
        open={Boolean(convertingLead)}
        lead={convertingLead}
        onOpenChange={(open) => !open && setConvertingLead(undefined)}
      />
      <LeadFormDialog open={isFormOpen} onOpenChange={setFormOpen} />
    </>
  )
}
