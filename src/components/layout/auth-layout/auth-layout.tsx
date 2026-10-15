import { Suspense } from 'react'
import { Outlet } from 'react-router-dom'
import { ApplyLinks } from '@/components/common/apply-links/apply-links'
import { BrandLogo } from '@/components/common/brand-logo/brand-logo'
import { PageLoader } from '@/components/common/page-loader/page-loader'
import { ShootingStars } from '@/components/common/shooting-stars/shooting-stars'
import { ThemeToggle } from '@/components/common/theme-toggle/theme-toggle'
import { AuthShowcase } from '../auth-showcase/auth-showcase'
import styles from './auth-layout.module.css'

export function AuthLayout() {
  return (
    <ShootingStars className={styles.root}>
      <AuthShowcase />
      <main className={styles.content}>
        <div className={styles.toolbar}>
          <BrandLogo size="sm" className={styles.mobileLogo} />
          <ThemeToggle />
        </div>
        <div className={styles.form}>
          <Suspense fallback={<PageLoader />}>
            <Outlet />
          </Suspense>
        </div>
        <ApplyLinks className={styles.mobileApply} />
      </main>
    </ShootingStars>
  )
}
