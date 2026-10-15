import { zodResolver } from '@hookform/resolvers/zod'
import { Loader2 } from 'lucide-react'
import { useForm } from 'react-hook-form'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { useAuth } from '@/hooks/use-auth'
import { findMenuItem } from '@/router/menu'
import { showToast } from '@/lib/show-toast'
import { loginSchema, type LoginFormValues } from '@/schemas/auth.schema'
import type { User } from '@/types'
import { ROUTE_PATHS } from '@/utils/validations/constants'
import { hasPermission } from '@/utils/validations/helpers'
import { messages } from '@/utils/validations/messages'
import { DemoAccounts } from './components/demo-accounts/demo-accounts'
import styles from './auth-page.module.css'

const resolveRedirect = (user: User, from?: string) => {
  const item = from ? findMenuItem(from) : undefined
  return from && item && hasPermission(user.role, item.permission) ? from : ROUTE_PATHS.dashboard
}

export default function LoginPage() {
  const { login } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const from = (location.state as { from?: string } | null)?.from

  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: '', password: '' },
  })

  const onSubmit = async (values: LoginFormValues) => {
    try {
      const user = await login(values)
      showToast.success(messages.auth.welcome(user.fullName))
      navigate(resolveRedirect(user, from), { replace: true })
    } catch (error) {
      showToast.error(error)
    }
  }

  const fillDemoAccount = (email: string, password: string) => {
    form.setValue('email', email, { shouldValidate: true })
    form.setValue('password', password, { shouldValidate: true })
  }

  return (
    <div className={styles.root}>
      <div className={styles.heading}>
        <h1 className={styles.title}>{messages.auth.loginTitle}</h1>
        <p className={styles.description}>{messages.auth.loginDescription}</p>
      </div>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className={styles.form} noValidate>
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{messages.auth.email}</FormLabel>
                <FormControl>
                  <Input type="email" autoComplete="email" placeholder={messages.auth.emailPlaceholder} {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <div className={styles.labelRow}>
                  <FormLabel>{messages.auth.password}</FormLabel>
                  <Link to={ROUTE_PATHS.forgotPassword} className={styles.link}>
                    {messages.auth.forgotPasswordLink}
                  </Link>
                </div>
                <FormControl>
                  <Input type="password" autoComplete="current-password" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button type="submit" disabled={form.formState.isSubmitting}>
            {form.formState.isSubmitting && <Loader2 className={styles.spinner} />}
            {messages.auth.loginButton}
          </Button>
        </form>
      </Form>
      <p className={styles.description}>{messages.auth.oneTimePasswordHint}</p>
      <DemoAccounts onSelect={fillDemoAccount} />
    </div>
  )
}
