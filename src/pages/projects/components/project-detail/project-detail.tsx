import { ExternalLink } from 'lucide-react'
import { DetailList } from '@/components/common/detail-list/detail-list'
import { StatusBadge } from '@/components/common/status-badge/status-badge'
import { Progress } from '@/components/ui/progress'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { useAuth } from '@/hooks/use-auth'
import { useClients } from '@/hooks/use-clients'
import { useDevelopers } from '@/hooks/use-developers'
import { useEntityMap } from '@/hooks/use-entity-map'
import { useFinances } from '@/hooks/use-finance'
import { FinanceOverview } from '@/pages/finance/components/finance-overview/finance-overview'
import { PERMISSIONS, type Project } from '@/types'
import {
  BRANCH_STATUS_CONFIG,
  CI_STATUS_CONFIG,
  OWNER_TYPE_CONFIG,
  PRIORITY_CONFIG,
  PROJECT_CATEGORY_LABELS,
  PROJECT_STATUS_CONFIG,
} from '@/utils/validations/constants'
import { formatDate, stripProtocol, toExternalUrl } from '@/utils/validations/formatters'
import { messages } from '@/utils/validations/messages'
import { ProjectActivity } from '../project-activity/project-activity'
import { ProjectTeam } from '../project-team/project-team'
import styles from './project-detail.module.css'

const { fields, tabs } = messages.projects

function ExternalAnchor({ url }: { url: string }) {
  if (!url) return <span className={styles.muted}>{messages.common.notSpecified}</span>
  return (
    <a href={toExternalUrl(url)} target="_blank" rel="noreferrer" className={styles.link}>
      {stripProtocol(url)}
      <ExternalLink />
    </a>
  )
}

export function ProjectDetail({ project }: { project: Project }) {
  const { can } = useAuth()
  const { data: clients } = useClients()
  const { data: developers } = useDevelopers()
  const { data: finances = [] } = useFinances()
  const clientMap = useEntityMap(clients)
  const developerMap = useEntityMap(developers)
  const client = clientMap.get(project.clientId)
  const finance = finances.find((item) => item.projectId === project.id)
  const canViewFinance = can(PERMISSIONS.FINANCE_VIEW)

  return (
    <Tabs defaultValue="overview" className={styles.root}>
      <TabsList className={styles.tabs}>
        <TabsTrigger value="overview">{tabs.overview}</TabsTrigger>
        <TabsTrigger value="team">{tabs.team}</TabsTrigger>
        <TabsTrigger value="github">{tabs.github}</TabsTrigger>
        <TabsTrigger value="activity">{tabs.activity}</TabsTrigger>
        {canViewFinance && <TabsTrigger value="finance">{tabs.finance}</TabsTrigger>}
      </TabsList>

      <TabsContent value="overview" className={styles.panel}>
        <section className={styles.section}>
          <h3 className={styles.heading}>{fields.description}</h3>
          <p className={styles.text}>{project.description}</p>
        </section>
        {project.problemStatement && (
          <section className={styles.section}>
            <h3 className={styles.heading}>{fields.problemStatement}</h3>
            <p className={styles.callout}>{project.problemStatement}</p>
          </section>
        )}
        <section className={styles.section}>
          <div className={styles.progressRow}>
            <span>{messages.projects.progress}</span>
            <span>%{project.progress}</span>
          </div>
          <Progress value={project.progress} />
        </section>
        <DetailList
          items={[
            { label: fields.client, value: client?.companyName ?? messages.common.notSpecified },
            { label: fields.category, value: PROJECT_CATEGORY_LABELS[project.category] },
            { label: fields.status, value: <StatusBadge config={PROJECT_STATUS_CONFIG[project.status]} /> },
            { label: fields.priority, value: <StatusBadge config={PRIORITY_CONFIG[project.priority]} /> },
            { label: fields.ownerType, value: <StatusBadge config={OWNER_TYPE_CONFIG[project.ownerType]} /> },
            { label: fields.startDate, value: formatDate(project.startDate) },
            { label: fields.dueDate, value: formatDate(project.dueDate) },
            {
              label: fields.contact,
              value:
                can(PERMISSIONS.CLIENTS_CONTACT_VIEW) && client ? (
                  <span className={styles.contact}>
                    {client.contactName}
                    <span className={styles.muted}>{client.email}</span>
                    <span className={styles.muted}>{client.phone}</span>
                  </span>
                ) : (
                  <span className={styles.muted}>{messages.common.hidden}</span>
                ),
            },
          ]}
        />
        {project.tags.length > 0 && (
          <div className={styles.tags}>
            {project.tags.map((tag) => (
              <StatusBadge key={tag} label={tag} />
            ))}
          </div>
        )}
      </TabsContent>

      <TabsContent value="team" className={styles.panel}>
        <ProjectTeam project={project} developers={developerMap} />
      </TabsContent>

      <TabsContent value="github" className={styles.panel}>
        <DetailList
          items={[
            { label: fields.repositoryUrl, value: <ExternalAnchor url={project.github.repositoryUrl} /> },
            { label: fields.organization, value: <ExternalAnchor url={project.github.organizationUrl} /> },
            { label: fields.branch, value: <code className={styles.code}>{project.github.branch}</code> },
            { label: fields.branchStatus, value: <StatusBadge config={BRANCH_STATUS_CONFIG[project.github.branchStatus]} /> },
            { label: fields.ciStatus, value: <StatusBadge config={CI_STATUS_CONFIG[project.github.ciStatus]} /> },
          ]}
        />
        <section className={styles.section}>
          <h3 className={styles.heading}>{fields.ciNotes}</h3>
          <p className={styles.text}>{project.github.ciNotes || messages.projects.noCiNotes}</p>
        </section>
      </TabsContent>

      <TabsContent value="activity" className={styles.panel}>
        <ProjectActivity project={project} />
      </TabsContent>

      {canViewFinance && (
        <TabsContent value="finance" className={styles.panel}>
          {finance ? <FinanceOverview finance={finance} /> : <p className={styles.muted}>{messages.projects.noFinance}</p>}
        </TabsContent>
      )}
    </Tabs>
  )
}
