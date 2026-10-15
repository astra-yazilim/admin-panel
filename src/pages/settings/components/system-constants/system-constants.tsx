import { Info } from 'lucide-react'
import { DetailList } from '@/components/common/detail-list/detail-list'
import { Card, CardContent } from '@/components/ui/card'
import {
  APP,
  CREDIT_UNIT_PRICE,
  CV_ACCEPTED_EXTENSIONS,
  CV_MAX_SIZE_MB,
  DEFAULT_COMMISSION_RATE,
  DEFAULT_PAYMENT_TERMS,
} from '@/utils/validations/constants'
import { formatCurrency, formatPercent } from '@/utils/validations/formatters'
import { messages } from '@/utils/validations/messages'
import styles from './system-constants.module.css'

const { system } = messages.settings

export function SystemConstants() {
  const { advance, milestone, final } = DEFAULT_PAYMENT_TERMS
  return (
    <Card>
      <CardContent className={styles.root}>
        <DetailList
          items={[
            { label: system.currency, value: APP.currency },
            { label: system.locale, value: APP.locale },
            { label: system.commissionRate, value: formatPercent(DEFAULT_COMMISSION_RATE) },
            {
              label: `${system.paymentTerms} (${messages.finance.termsLegend})`,
              value: messages.finance.termsFormat(advance, milestone, final),
            },
            { label: system.creditUnitPrice, value: formatCurrency(CREDIT_UNIT_PRICE) },
            {
              label: system.cvLimits,
              value: system.cvLimitsValue(CV_ACCEPTED_EXTENSIONS.join(', ').toUpperCase(), CV_MAX_SIZE_MB),
            },
          ]}
        />
        <p className={styles.hint}>
          <Info />
          {system.readOnlyHint}
        </p>
      </CardContent>
    </Card>
  )
}
