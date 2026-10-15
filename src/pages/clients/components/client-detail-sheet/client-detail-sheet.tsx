import { useState } from 'react'
import { ConfirmDialog } from '@/components/common/confirm-dialog/confirm-dialog'
import { DetailList } from '@/components/common/detail-list/detail-list'
import { StatusBadge } from '@/components/common/status-badge/status-badge'
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from '@/components/ui/sheet'
import { useAuth } from '@/hooks/use-auth'
import { useSendSurvey } from '@/hooks/use-clients'
import { PERMISSIONS, type Client, type Project, type Survey } from '@/types'
import { CLIENT_STATUS_CONFIG } from '@/utils/validations/constants'
import { formatDate } from '@/utils/validations/formatters'
import { messages } from '@/utils/validations/messages'
import { ClientProjectItem } from '../client-project-item/client-project-item'
import styles from './client-detail-sheet.module.css'

interface ClientDetailSheetProps {
  client: Client | undefined
  projects: Project[]
  surveys: Survey[]
  onOpenChange: (open: boolean) => void
}

const { fields } = messages.clients

export function ClientDetailSheet({ client, projects, surveys, onOpenChange }: ClientDetailSheetProps) {
  const { can } = useAuth()
  const sendSurvey = useSendSurvey()
  const [surveyProject, setSurveyProject] = useState<Project>()
  const clientProjects = projects.filter((project) => project.clientId === client?.id)
  const showContact = can(PERMISSIONS.CLIENTS_CONTACT_VIEW)

  return (
    <Sheet open={Boolean(client)} onOpenChange={onOpenChange}>
      <SheetContent className={styles.content}>
        {client && (
          <>
            <SheetHeader className={styles.header}>
              <StatusBadge config={CLIENT_STATUS_CONFIG[client.status]} className={styles.badge} />
              <SheetTitle>{client.companyName}</SheetTitle>
              <SheetDescription>{client.sector}</SheetDescription>
            </SheetHeader>
            <div className={styles.body}>
              <DetailList
                items={[
                  { label: fields.contactName, value: showContact ? client.contactName : messages.common.hidden },
                  { label: fields.email, value: showContact ? client.email : messages.common.hidden },
                  { label: fields.phone, value: showContact ? client.phone : messages.common.hidden },
                  { label: fields.website, value: client.website || messages.common.notSpecified },
                  { label: fields.city, value: client.city || messages.common.notSpecified },
                  { label: fields.createdAt, value: formatDate(client.createdAt) },
                ]}
              />
              <section className={styles.section}>
                <h3 className={styles.heading}>{messages.clients.projectsTitle}</h3>
                <p className={styles.hint}>{messages.clients.surveyAvailableHint}</p>
                {clientProjects.length === 0 && <p className={styles.hint}>{messages.clients.noProjects}</p>}
                <ul className={styles.projects}>
                  {clientProjects.map((project) => (
                    <ClientProjectItem
                      key={project.id}
                      project={project}
                      survey={surveys.find((survey) => survey.projectId === project.id)}
                      canSendSurvey={can(PERMISSIONS.SURVEYS_SEND)}
                      onSendSurvey={() => setSurveyProject(project)}
                    />
                  ))}
                </ul>
              </section>
            </div>
            <ConfirmDialog
              open={Boolean(surveyProject)}
              onOpenChange={(open) => !open && setSurveyProject(undefined)}
              title={messages.clients.sendSurveyTitle}
              description={messages.clients.sendSurveyDescription(client.email, surveyProject?.code ?? '')}
              confirmLabel={messages.clients.sendSurvey}
              onConfirm={() => surveyProject && sendSurvey.mutate(surveyProject)}
            />
          </>
        )}
      </SheetContent>
    </Sheet>
  )
}
