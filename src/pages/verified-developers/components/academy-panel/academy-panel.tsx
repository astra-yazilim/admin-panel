import { Clock, GraduationCap } from 'lucide-react'
import { SelectField } from '@/components/common/select-field/select-field'
import { StatusBadge } from '@/components/common/status-badge/status-badge'
import { UserAvatar } from '@/components/common/user-avatar/user-avatar'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { useAuth } from '@/hooks/use-auth'
import {
  useDevelopers,
  useTrainingAssignments,
  useTrainingModules,
  useUpdateTrainingStatus,
} from '@/hooks/use-developers'
import { useEntityMap } from '@/hooks/use-entity-map'
import { PERMISSIONS, type TrainingStatus } from '@/types'
import { SENIORITY_LABELS, TRAINING_SOURCE_LABELS, TRAINING_STATUS_CONFIG } from '@/utils/validations/constants'
import { toStatusOptions } from '@/utils/validations/helpers'
import { messages } from '@/utils/validations/messages'
import styles from './academy-panel.module.css'

const STATUS_OPTIONS = toStatusOptions(TRAINING_STATUS_CONFIG)
const { academy } = messages.developers

export function AcademyPanel() {
  const { can } = useAuth()
  const { data: modules = [] } = useTrainingModules()
  const { data: assignments = [] } = useTrainingAssignments()
  const { data: developers } = useDevelopers()
  const updateStatus = useUpdateTrainingStatus()
  const developerMap = useEntityMap(developers)
  const moduleMap = useEntityMap(modules)
  const canManage = can(PERMISSIONS.ACADEMY_MANAGE)

  return (
    <div className={styles.root}>
      <section className={styles.section}>
        <h2 className={styles.heading}>{academy.modules}</h2>
        <div className={styles.modules}>
          {modules.map((module) => (
            <Card key={module.id} className={styles.module}>
              <CardHeader>
                <div className={styles.moduleMeta}>
                  <StatusBadge label={SENIORITY_LABELS[module.targetLevel]} tone="primary" />
                  <span className={styles.duration}>
                    <Clock />
                    {academy.duration(module.durationHours)}
                  </span>
                </div>
                <CardTitle className={styles.moduleTitle}>{module.title}</CardTitle>
                <CardDescription>{module.description}</CardDescription>
              </CardHeader>
              <CardContent className={styles.moduleFooter}>
                <GraduationCap />
                {academy.assignedCount(assignments.filter((item) => item.moduleId === module.id).length)}
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      <section className={styles.section}>
        <h2 className={styles.heading}>{academy.assignments}</h2>
        <div className={styles.table}>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>{academy.developer}</TableHead>
                <TableHead>{academy.module}</TableHead>
                <TableHead>{academy.skillGap}</TableHead>
                <TableHead>{academy.source}</TableHead>
                <TableHead>{academy.status}</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {assignments.map((assignment) => {
                const developer = developerMap.get(assignment.developerId)
                return (
                  <TableRow key={assignment.id}>
                    <TableCell>
                      <span className={styles.developer}>
                        <UserAvatar name={developer?.fullName ?? ''} size="sm" />
                        <span className={styles.identity}>
                          <span>{developer?.fullName}</span>
                          <span className={styles.muted}>{developer && SENIORITY_LABELS[developer.seniority]}</span>
                        </span>
                      </span>
                    </TableCell>
                    <TableCell className={styles.moduleCell}>{moduleMap.get(assignment.moduleId)?.title}</TableCell>
                    <TableCell className={styles.gap}>{assignment.skillGap}</TableCell>
                    <TableCell>
                      <StatusBadge
                        label={TRAINING_SOURCE_LABELS[assignment.source]}
                        tone={assignment.source === 'client_feedback' ? 'gold' : 'neutral'}
                      />
                    </TableCell>
                    <TableCell className={styles.status}>
                      {canManage ? (
                        <SelectField<TrainingStatus>
                          value={assignment.status}
                          onValueChange={(status) => updateStatus.mutate({ id: assignment.id, status })}
                          options={STATUS_OPTIONS}
                          aria-label={academy.status}
                        />
                      ) : (
                        <StatusBadge config={TRAINING_STATUS_CONFIG[assignment.status]} />
                      )}
                    </TableCell>
                  </TableRow>
                )
              })}
            </TableBody>
          </Table>
        </div>
      </section>
    </div>
  )
}
