import { zodResolver } from '@hookform/resolvers/zod'
import { ArrowLeft, Loader2, MailCheck } from 'lucide-react'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { Link } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { showToast } from '@/lib/show-toast'
import { forgotPasswordSchema, type ForgotPasswordFormValues } from '@/schemas/auth.schema'
import { authService } from '@/services/auth.service'
import { ROUTE_PATHS } from '@/utils/validations/constants'
import { messages } from '@/utils/validations/messages'
import styles from './auth-page.module.css'

export default function ForgotPasswordPage() {
  const [isSent, setIsSent] = useState(false)
  const form = useForm<ForgotPasswordFormValues>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: { email: '' },
  })

  const onSubmit = async ({ email }: ForgotPasswordFormValues) => {
    try {
      await authService.requestPasswordReset(email)
      setIsSent(true)
    } catch (error) {
      showToast.error(error)
    }
  }

  return (
    <div className={styles.root}>
      <div className={styles.heading}>
        <h1 className={styles.title}>{messages.auth.forgotPasswordTitle}</h1>
        <p className={styles.description}>{messages.auth.forgotPasswordDescription}</p>
      </div>
      {isSent ? (
        <p className={styles.success}>
          <MailCheck />
          {messages.auth.resetLinkSent}
        </p>
      ) : (
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className={styles.form} noValidate>
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{messages.auth.email}</FormLabel>
                  <FormControl>
                    <Input type="email" placeholder={messages.auth.emailPlaceholder} {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" disabled={form.formState.isSubmitting}>
              {form.formState.isSubmitting && <Loader2 className={styles.spinner} />}
              {messages.auth.sendResetLink}
            </Button>
          </form>
        </Form>
      )}
      <Link to={ROUTE_PATHS.login} className={styles.backLink}>
        <ArrowLeft />
        {messages.auth.backToLogin}
      </Link>
    </div>
  )
}
