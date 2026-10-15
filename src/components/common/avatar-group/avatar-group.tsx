import { UserAvatar } from '@/components/common/user-avatar/user-avatar'
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip'
import styles from './avatar-group.module.css'

interface AvatarGroupProps {
  names: string[]
  max?: number
}

export function AvatarGroup({ names, max = 3 }: AvatarGroupProps) {
  const visible = names.slice(0, max)
  const hiddenCount = names.length - visible.length
  return (
    <div className={styles.root}>
      {visible.map((name) => (
        <Tooltip key={name}>
          <TooltipTrigger asChild>
            <span className={styles.item}>
              <UserAvatar name={name} size="sm" className={styles.avatar} />
            </span>
          </TooltipTrigger>
          <TooltipContent>{name}</TooltipContent>
        </Tooltip>
      ))}
      {hiddenCount > 0 && <span className={styles.more}>+{hiddenCount}</span>}
    </div>
  )
}
