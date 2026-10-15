import iconMarkup from '@/assets/logo/astra-icon.svg?raw'
import logoMarkup from '@/assets/logo/astra-logo.svg?raw'
import { cn } from '@/lib/utils'
import { APP } from '@/utils/validations/constants'
import styles from './brand-logo.module.css'

const NAVY_FILL = /fill="#1[34]2[34]40"/g
const EMBEDDED_STYLE = /<style>[\s\S]*?<\/style>/
const FIXED_SIZE = /\s(width|height)="\d+"/g

const toThemeable = (markup: string) =>
  markup.replace(EMBEDDED_STYLE, '').replace(NAVY_FILL, 'fill="currentColor"').replace(FIXED_SIZE, '')

const LOGO = toThemeable(logoMarkup)
const ICON = toThemeable(iconMarkup)

interface BrandLogoProps {
  variant?: 'full' | 'icon'
  size?: 'sm' | 'md' | 'lg'
  className?: string
}

export function BrandLogo({ variant = 'full', size = 'md', className }: BrandLogoProps) {
  return (
    <span
      role="img"
      aria-label={APP.companyName}
      className={cn(styles.root, styles[variant], styles[size], className)}
      dangerouslySetInnerHTML={{ __html: variant === 'full' ? LOGO : ICON }}
    />
  )
}
