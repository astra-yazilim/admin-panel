import { Briefcase, CalendarClock, FolderKanban, Inbox, Lightbulb, Smile, UserPlus, Wallet } from 'lucide-react'
import { PageHeader } from '@/components/common/page-header/page-header'
import { StatCard } from '@/components/common/stat-card/stat-card'
import { BarList } from '@/components/common/bar-list/bar-list'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { useAuth } from '@/hooks/use-auth'
import { useSurveys } from '@/hooks/use-clients'
import { useApplications } from '@/hooks/use-developers'
import { useFinances } from '@/hooks/use-finance'
import { useInvestors } from '@/hooks/use-investors'
import { useProjectSubmissions } from '@/hooks/use-project-submissions'
import { useLeads } from '@/hooks/use-leads'
import { useProjects } from '@/hooks/use-projects'
import { PERMISSIONS } from '@/types'
import {
  LEAD_STATUS_CONFIG,
  LEAD_STATUS_ORDER,
  MAX_RATING,
  PROJECT_STATUS_CONFIG,
  PROJECT_STATUS_ORDER,
  UPCOMING_DEADLINE_DAYS,
} from '@/utils/validations/constants'
import { formatCompactCurrency, formatNumber } from '@/utils/validations/formatters'
import { average, countBy, daysUntil, getFinanceSummary } from '@/utils/validations/helpers'
import { messages } from '@/utils/validations/messages'
import { ActivityFeed } from './components/activity-feed/activity-feed'
import { DeadlineList } from './components/deadline-list/deadline-list'
import styles from './dashboard-page.module.css'

const { dashboard } = messages

export default function DashboardPage() {
  const { user, can } = useAuth()
  const canViewLeads = can(PERMISSIONS.LEADS_VIEW)
  const canViewProjects = can(PERMISSIONS.PROJECTS_VIEW)
  const canViewDevelopers = can(PERMISSIONS.DEVELOPERS_VIEW)
  const canViewFinance = can(PERMISSIONS.FINANCE_VIEW)
  const canViewClients = can(PERMISSIONS.CLIENTS_VIEW)
  const canViewSubmissions = can(PERMISSIONS.SUBMISSIONS_VIEW)
  const canViewInvestors = can(PERMISSIONS.INVESTORS_VIEW)

  const { data: projects = [] } = useProjects()
  const { data: leads = [] } = useLeads()
  const { data: applications = [] } = useApplications()
  const { data: finances = [] } = useFinances()
  const { data: surveys = [] } = useSurveys()
  const { data: submissions = [] } = useProjectSubmissions()
  const { data: investors = [] } = useInvestors()

  const activeProjects = projects.filter((project) => project.status !== 'live')
  const upcomingProjects = activeProjects
    .filter((project) => daysUntil(project.dueDate) <= UPCOMING_DEADLINE_DAYS)
    .sort((a, b) => a.dueDate.localeCompare(b.dueDate))
  const pendingApplications = applications.filter((item) => !['approved', 'rejected'].includes(item.status))
  const completedSurveys = surveys.filter((survey) => survey.status === 'completed')
  const financeSummary = getFinanceSummary(finances)

  const projectCounts = countBy(projects, (project) => project.status)
  const submissionCounts = countBy(submissions, (submission) => submission.status)
  const investorCounts = countBy(investors, (investor) => investor.status)
  const leadCounts = countBy(leads, (lead) => lead.status)

  return (
    <>
      <PageHeader title={messages.auth.welcome(user?.fullName.split(' ')[0] ?? '')} description={dashboard.description} />

      <section className={styles.kpis}>
        {canViewProjects && (
          <StatCard
            icon={FolderKanban}
            label={dashboard.kpi.activeProjects}
            value={activeProjects.length}
            hint={dashboard.kpi.activeProjectsHint(activeProjects.filter((p) => p.priority === 'critical').length)}
          />
        )}
        {canViewProjects && (
          <StatCard
            icon={CalendarClock}
            tone="gold"
            label={dashboard.kpi.upcomingDeadlines}
            value={upcomingProjects.length}
            hint={dashboard.kpi.upcomingDeadlinesHint(UPCOMING_DEADLINE_DAYS)}
          />
        )}
        {canViewLeads && (
          <StatCard
            icon={Inbox}
            tone="info"
            label={dashboard.kpi.newLeads}
            value={leadCounts.new ?? 0}
            hint={dashboard.kpi.newLeadsHint(leads.length)}
          />
        )}
        {canViewDevelopers && (
          <StatCard
            icon={UserPlus}
            label={dashboard.kpi.pendingApplications}
            value={pendingApplications.length}
            hint={dashboard.kpi.pendingApplicationsHint(
              pendingApplications.filter((item) => item.status === 'interview').length,
            )}
          />
        )}
        {canViewFinance && (
          <StatCard
            icon={Wallet}
            tone="gold"
            label={dashboard.kpi.collected}
            value={formatCompactCurrency(financeSummary.collected)}
            hint={dashboard.kpi.collectedHint(formatCompactCurrency(financeSummary.totalBudget))}
          />
        )}
        {canViewClients && (
          <StatCard
            icon={Smile}
            tone="info"
            label={dashboard.kpi.satisfaction}
            value={`${formatNumber(average(completedSurveys.map((s) => s.overallRating ?? 0)), 1)} / ${MAX_RATING}`}
            hint={dashboard.kpi.satisfactionHint(completedSurveys.length)}
          />
        )}
        {canViewSubmissions && (
          <StatCard
            icon={Lightbulb}
            tone="gold"
            label={dashboard.kpi.pendingSubmissions}
            value={submissionCounts.received ?? 0}
            hint={dashboard.kpi.pendingSubmissionsHint(submissionCounts.technical_review ?? 0)}
          />
        )}
        {canViewInvestors && (
          <StatCard
            icon={Briefcase}
            label={dashboard.kpi.pendingInvestors}
            value={(investorCounts.received ?? 0) + (investorCounts.reviewing ?? 0) + (investorCounts.meeting ?? 0)}
            hint={dashboard.kpi.pendingInvestorsHint(investorCounts.approved ?? 0)}
          />
        )}
      </section>

      <section className={styles.grid}>
        {canViewProjects && (
          <Card>
            <CardHeader>
              <CardTitle>{dashboard.projectDistribution}</CardTitle>
              <CardDescription>{dashboard.projectDistributionDescription}</CardDescription>
            </CardHeader>
            <CardContent>
              <BarList
                items={PROJECT_STATUS_ORDER.map((status) => ({
                  key: status,
                  label: PROJECT_STATUS_CONFIG[status].label,
                  value: projectCounts[status] ?? 0,
                  displayValue: dashboard.projectCount(projectCounts[status] ?? 0),
                }))}
              />
            </CardContent>
          </Card>
        )}
        {canViewLeads && (
          <Card>
            <CardHeader>
              <CardTitle>{dashboard.leadFunnel}</CardTitle>
              <CardDescription>{dashboard.leadFunnelDescription}</CardDescription>
            </CardHeader>
            <CardContent>
              <BarList
                items={LEAD_STATUS_ORDER.map((status) => ({
                  key: status,
                  label: LEAD_STATUS_CONFIG[status].label,
                  value: leadCounts[status] ?? 0,
                }))}
              />
            </CardContent>
          </Card>
        )}
        {canViewProjects && (
          <Card>
            <CardHeader>
              <CardTitle>{dashboard.deadlines}</CardTitle>
            </CardHeader>
            <CardContent>
              <DeadlineList projects={upcomingProjects} />
            </CardContent>
          </Card>
        )}
        {canViewProjects && (
          <Card>
            <CardHeader>
              <CardTitle>{dashboard.recentActivity}</CardTitle>
            </CardHeader>
            <CardContent>
              <ActivityFeed projects={projects} />
            </CardContent>
          </Card>
        )}
      </section>
    </>
  )
}
