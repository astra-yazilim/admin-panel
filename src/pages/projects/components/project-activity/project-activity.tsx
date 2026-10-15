import { Loader2 } from 'lucide-react'
import { useState } from 'react'
import { UserAvatar } from '@/components/common/user-avatar/user-avatar'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { useAddProjectNote } from '@/hooks/use-projects'
import type { Project } from '@/types'
import { formatDateTime } from '@/utils/validations/formatters'
import { messages } from '@/utils/validations/messages'
import styles from './project-activity.module.css'

export function ProjectActivity({ project }: { project: Project }) {
  const [note, setNote] = useState('')
  const addNote = useAddProjectNote()

  const submit = () => {
    if (!note.trim()) return
    addNote.mutate({ id: project.id, note: note.trim() }, { onSuccess: () => setNote('') })
  }

  return (
    <div className={styles.root}>
      <div className={styles.composer}>
        <Textarea
          value={note}
          onChange={(event) => setNote(event.target.value)}
          placeholder={messages.projects.notePlaceholder}
          rows={3}
        />
        <Button size="sm" onClick={submit} disabled={!note.trim() || addNote.isPending} className={styles.submit}>
          {addNote.isPending && <Loader2 className={styles.spinner} />}
          {messages.projects.addNote}
        </Button>
      </div>
      <ol className={styles.timeline}>
        {project.activity.map((entry) => (
          <li key={entry.id} className={styles.entry}>
            <UserAvatar name={entry.authorName} size="sm" />
            <div className={styles.body}>
              <p className={styles.meta}>
                <span className={styles.author}>{entry.authorName}</span>
                <time dateTime={entry.createdAt}>{formatDateTime(entry.createdAt)}</time>
              </p>
              <p className={styles.message}>{entry.message}</p>
            </div>
          </li>
        ))}
      </ol>
    </div>
  )
}
