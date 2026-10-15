import { Monitor, Moon, Sun, type LucideIcon } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { useTheme } from '@/hooks/use-theme'
import type { ThemePreference } from '@/types'
import { THEME_LABELS } from '@/utils/validations/constants'
import { toOptions } from '@/utils/validations/helpers'
import { messages } from '@/utils/validations/messages'

const THEME_ICONS: Record<ThemePreference, LucideIcon> = {
  light: Sun,
  dark: Moon,
  system: Monitor,
}

const THEME_OPTIONS = toOptions(THEME_LABELS)

export function ThemeToggle() {
  const { theme, setTheme } = useTheme()
  const Icon = THEME_ICONS[theme]

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" aria-label={messages.common.toggleTheme}>
          <Icon />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuRadioGroup value={theme} onValueChange={(value) => setTheme(value as ThemePreference)}>
          {THEME_OPTIONS.map((option) => {
            const OptionIcon = THEME_ICONS[option.value]
            return (
              <DropdownMenuRadioItem key={option.value} value={option.value}>
                <OptionIcon />
                {option.label}
              </DropdownMenuRadioItem>
            )
          })}
        </DropdownMenuRadioGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
