type LogLevel = 'debug' | 'info' | 'warn' | 'error'

const isDevelopment = import.meta.env.DEV

const log = (level: LogLevel, message: string, ...details: unknown[]) => {
  if (!isDevelopment && level === 'debug') return
  console[level](`[astra:${level}] ${message}`, ...details)
}

export const logger = {
  debug: (message: string, ...details: unknown[]) => log('debug', message, ...details),
  info: (message: string, ...details: unknown[]) => log('info', message, ...details),
  warn: (message: string, ...details: unknown[]) => log('warn', message, ...details),
  error: (message: string, ...details: unknown[]) => log('error', message, ...details),
}
