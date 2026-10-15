import { Code2, LayoutDashboard, Lightbulb, TrendingUp, type LucideIcon } from 'lucide-react'
import type { CSSProperties } from 'react'
import { ApplyLinks } from '@/components/common/apply-links/apply-links'
import { BrandLogo } from '@/components/common/brand-logo/brand-logo'
import { Sparkle } from '@/components/common/sparkle/sparkle'
import { messages } from '@/utils/validations/messages'
import styles from './auth-showcase.module.css'

const { showcase } = messages.auth

const AUDIENCE_ICONS: Record<string, LucideIcon> = {
  team: LayoutDashboard,
  developers: Code2,
  investors: TrendingUp,
  owners: Lightbulb,
}

const SPARKLES = [
  { size: 18, top: '4%', left: '10%', delay: 0 },
  { size: 10, top: '18%', left: '86%', delay: 1.2 },
  { size: 14, top: '72%', left: '2%', delay: 2.1 },
  { size: 8, top: '90%', left: '76%', delay: 0.6 },
]

const orbitStyle = (index: number, total: number) =>
  ({ '--angle': `${(360 / total) * index}deg` }) as CSSProperties

export function AuthShowcase() {
  const [firstLine, secondLine] = showcase.slogan.split('\n')

  return (
    <aside className={styles.root}>
      <div className={styles.grid} aria-hidden />
      <div className={styles.glow} aria-hidden />

      <BrandLogo size="md" />

      <div className={styles.copy}>
        <span className={styles.eyebrow}>{showcase.eyebrow}</span>
        <h2 className={styles.slogan}>
          {firstLine}
          <br />
          <span className={styles.accent}>{secondLine}</span>
        </h2>
        <p className={styles.description}>{showcase.description}</p>
      </div>

      <div className={styles.feature}>
        <div className={styles.constellation} aria-hidden>
          {SPARKLES.map(({ size, delay, ...position }) => (
            <Sparkle
              key={`${position.top}-${position.left}`}
              size={size}
              delay={delay}
              className={styles.sparkle}
              style={position}
            />
          ))}
          <div className={styles.ringOuter}>
            {showcase.orbit.map((label, index) => (
              <span key={label} className={styles.node} style={orbitStyle(index, showcase.orbit.length)}>
                <span className={styles.nodeLabel}>{label}</span>
              </span>
            ))}
          </div>
          <div className={styles.ringInner} />
          <div className={styles.core}>
            <BrandLogo variant="icon" size="lg" />
          </div>
        </div>

        <section className={styles.audiences}>
          <h3 className={styles.audiencesTitle}>{showcase.audiencesTitle}</h3>
          <ul className={styles.audienceList}>
            {showcase.audiences.map((audience, index) => {
              const Icon = AUDIENCE_ICONS[audience.key]
              return (
                <li key={audience.key} className={styles.audience} style={{ animationDelay: `${0.12 * index}s` }}>
                  <span className={styles.audienceIcon}>
                    <Icon />
                  </span>
                  <span className={styles.audienceText}>
                    <span className={styles.audienceTitle}>{audience.title}</span>
                    <span className={styles.audienceDescription}>{audience.description}</span>
                  </span>
                </li>
              )
            })}
          </ul>
        </section>
      </div>

      <div className={styles.footer}>
        <ApplyLinks />
        <p className={styles.copyright}>{showcase.footer(new Date().getFullYear())}</p>
      </div>
    </aside>
  )
}
