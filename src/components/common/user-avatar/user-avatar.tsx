import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { cn } from '@/lib/utils'
import { getInitials } from '@/utils/validations/formatters'
import styles from './user-avatar.module.css'

interface UserAvatarProps {
  name: string
  imageUrl?: string
  size?: 'sm' | 'md' | 'lg'
  className?: string
}

export function UserAvatar({ name, imageUrl, size = 'md', className }: UserAvatarProps) {
  return (
    <Avatar className={cn(styles[size], className)}>
      {imageUrl && <AvatarImage src={imageUrl} alt={name} />}
      <AvatarFallback className={styles.fallback}>{getInitials(name)}</AvatarFallback>
    </Avatar>
  )
}
