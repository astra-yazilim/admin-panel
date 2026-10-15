import { APP } from './constants'

const currencyFormatter = new Intl.NumberFormat(APP.locale, {
  style: 'currency',
  currency: APP.currency,
  maximumFractionDigits: 0,
})

const compactCurrencyFormatter = new Intl.NumberFormat(APP.locale, {
  style: 'currency',
  currency: APP.currency,
  notation: 'compact',
  maximumFractionDigits: 1,
})

const dateFormatter = new Intl.DateTimeFormat(APP.locale, {
  day: '2-digit',
  month: 'short',
  year: 'numeric',
  timeZone: APP.timeZone,
})

const dateTimeFormatter = new Intl.DateTimeFormat(APP.locale, {
  day: '2-digit',
  month: 'short',
  hour: '2-digit',
  minute: '2-digit',
  timeZone: APP.timeZone,
})

const relativeFormatter = new Intl.RelativeTimeFormat(APP.locale, { numeric: 'auto' })

const DAY_MS = 86_400_000

export const formatCurrency = (value: number) => currencyFormatter.format(value)

export const formatCompactCurrency = (value: number) => compactCurrencyFormatter.format(value)

export const formatNumber = (value: number, fractionDigits = 0) =>
  new Intl.NumberFormat(APP.locale, { maximumFractionDigits: fractionDigits }).format(value)

export const formatPercent = (ratio: number) =>
  new Intl.NumberFormat(APP.locale, { style: 'percent', maximumFractionDigits: 1 }).format(ratio)

export const formatDate = (iso: string) => dateFormatter.format(new Date(iso))

export const formatDateTime = (iso: string) => dateTimeFormatter.format(new Date(iso))

export const formatRelativeDate = (iso: string, now = new Date()) => {
  const diffDays = Math.round((new Date(iso).getTime() - now.getTime()) / DAY_MS)
  if (Math.abs(diffDays) < 1) {
    const diffHours = Math.round((new Date(iso).getTime() - now.getTime()) / 3_600_000)
    return relativeFormatter.format(diffHours, 'hour')
  }
  return relativeFormatter.format(diffDays, 'day')
}

export const formatFileSize = (bytes: number) => {
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1024 * 1024) return `${formatNumber(bytes / 1024, 1)} KB`
  return `${formatNumber(bytes / (1024 * 1024), 1)} MB`
}

export const getInitials = (fullName: string) =>
  fullName
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toLocaleUpperCase(APP.locale))
    .join('')

export const stripProtocol = (url: string) => url.replace(/^https?:\/\//, '').replace(/\/$/, '')

export const toExternalUrl = (url: string) => (/^https?:\/\//.test(url) ? url : `https://${url}`)

export const toDateInputValue = (iso: string) => iso.slice(0, 10)

export const withQuery = (path: string, params: Record<string, string>) => `${path}?${new URLSearchParams(params)}`

export const buildPath = (path: string, params: Record<string, string>) =>
  Object.entries(params).reduce((result, [key, value]) => result.replace(`:${key}`, value), path)

export const toDateTimeInputValue = (iso?: string) => {
  if (!iso) return ''
  const date = new Date(iso)
  return new Date(date.getTime() - date.getTimezoneOffset() * 60_000).toISOString().slice(0, 16)
}
