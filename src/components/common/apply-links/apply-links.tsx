import { ArrowUpRight, Lightbulb, TrendingUp } from 'lucide-react'
import { cn } from '@/lib/utils'
import { LANDING_LINKS } from '@/utils/validations/constants'
import { messages } from '@/utils/validations/messages'
import styles from './apply-links.module.css'

const { showcase } = messages.auth

const LINKS = [
  { href: LANDING_LINKS.investorApplication, label: showcase.applyLinks.investor, icon: TrendingUp },
  { href: LANDING_LINKS.projectApplication, label: showcase.applyLinks.project, icon: Lightbulb },
]

export function ApplyLinks({ className }: { className?: string }) {
  return (
    <div className={cn(styles.root, className)}>
      <span className={styles.title}>{showcase.applyTitle}</span>
      <div className={styles.links}>
        {LINKS.map(({ href, label, icon: Icon }) => (
          <a key={href} href={href} target="_blank" rel="noreferrer" className={styles.link}>
            <Icon />
            {label}
            <ArrowUpRight className={styles.arrow} />
          </a>
        ))}
      </div>
    </div>
  )
}
