import { StatusBadge } from '@/components/common/status-badge/status-badge'
import { UserAvatar } from '@/components/common/user-avatar/user-avatar'
import type { Developer, Project } from '@/types'
import { DEVELOPER_TYPE_CONFIG, SENIORITY_LABELS } from '@/utils/validations/constants'
import { messages } from '@/utils/validations/messages'
import styles from './project-team.module.css'

interface ProjectTeamProps {
  project: Project
  developers: Map<string, Developer>
}

export function ProjectTeam({ project, developers }: ProjectTeamProps) {
  const assignees = project.assigneeIds.map((id) => developers.get(id)).filter((item) => item !== undefined)

  return (
    <div className={styles.root}>
      <p className={styles.level}>
        {messages.projects.fields.assigneeLevel}: <strong>{SENIORITY_LABELS[project.assigneeLevel]}</strong>
      </p>
      {assignees.length === 0 && <p className={styles.empty}>{messages.projects.noAssignees}</p>}
      <ul className={styles.list}>
        {assignees.map((developer) => (
          <li key={developer.id} className={styles.member}>
            <UserAvatar name={developer.fullName} />
            <div className={styles.identity}>
              <span className={styles.name}>{developer.fullName}</span>
              <span className={styles.title}>
                {developer.title} · {messages.projects.completedTasks(developer.completedTasks)}
              </span>
            </div>
            <div className={styles.badges}>
              <StatusBadge label={SENIORITY_LABELS[developer.seniority]} />
              <StatusBadge config={DEVELOPER_TYPE_CONFIG[developer.type]} />
            </div>
          </li>
        ))}
      </ul>
    </div>
  )
}
