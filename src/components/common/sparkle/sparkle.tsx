import type { CSSProperties } from 'react'
import { cn } from '@/lib/utils'
import styles from './sparkle.module.css'

const STAR_PATH = 'M12 0 14.6 9.4 24 12 14.6 14.6 12 24 9.4 14.6 0 12 9.4 9.4Z'

interface SparkleProps {
  size: number
  delay?: number
  className?: string
  style?: CSSProperties
}

export function Sparkle({ size, delay = 0, className, style }: SparkleProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      aria-hidden
      className={cn(styles.root, className)}
      style={{ width: size, height: size, animationDelay: `${delay}s`, ...style }}
    >
      <path d={STAR_PATH} />
    </svg>
  )
}
