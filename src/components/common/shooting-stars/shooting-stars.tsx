import type { CSSProperties, ReactNode } from 'react'
import { cn } from '@/lib/utils'
import styles from './shooting-stars.module.css'

const STARS = [
  { top: '8%', left: '92%', delay: '0s', duration: '11s', length: '130px' },
  { top: '22%', left: '70%', delay: '3.6s', duration: '13s', length: '100px' },
  { top: '4%', left: '48%', delay: '6.8s', duration: '12s', length: '150px' },
  { top: '36%', left: '98%', delay: '9.2s', duration: '14s', length: '110px' },
  { top: '14%', left: '30%', delay: '12.4s', duration: '15s', length: '90px' },
]

interface ShootingStarsProps {
  children: ReactNode
  className?: string
}

export function ShootingStars({ children, className }: ShootingStarsProps) {
  return (
    <div className={cn(styles.scene, className)}>
      <div className={styles.sky} aria-hidden>
        {STARS.map((star) => (
          <span
            key={`${star.top}-${star.left}`}
            className={styles.star}
            style={
              {
                '--top': star.top,
                '--left': star.left,
                '--delay': star.delay,
                '--duration': star.duration,
                '--length': star.length,
              } as CSSProperties
            }
          />
        ))}
      </div>
      {children}
    </div>
  )
}
