/**
 * Logger personalizado que solo imprime en desarrollo
 * En producción, solo muestra errores críticos
 */

type LogLevel = 'log' | 'info' | 'warn' | 'error' | 'debug'

class Logger {
  private isDevelopment = process.env.NODE_ENV === 'development'

  /**
   * Log general - solo en desarrollo
   */
  log(...args: any[]) {
    if (this.isDevelopment) {
      console.log('[LOG]', ...args)
    }
  }

  /**
   * Info - solo en desarrollo
   */
  info(...args: any[]) {
    if (this.isDevelopment) {
      console.info('[INFO]', ...args)
    }
  }

  /**
   * Warning - solo en desarrollo
   */
  warn(...args: any[]) {
    if (this.isDevelopment) {
      console.warn('[WARN]', ...args)
    }
  }

  /**
   * Error - siempre se muestra (crítico)
   */
  error(...args: any[]) {
    console.error('[ERROR]', ...args)
  }

  /**
   * Debug - solo en desarrollo con flag específico
   */
  debug(...args: any[]) {
    if (this.isDevelopment && process.env.NEXT_PUBLIC_DEBUG === 'true') {
      console.debug('[DEBUG]', ...args)
    }
  }

  /**
   * Log con contexto (útil para tracking)
   */
  withContext(context: string) {
    return {
      log: (...args: any[]) => this.log(`[${context}]`, ...args),
      info: (...args: any[]) => this.info(`[${context}]`, ...args),
      warn: (...args: any[]) => this.warn(`[${context}]`, ...args),
      error: (...args: any[]) => this.error(`[${context}]`, ...args),
      debug: (...args: any[]) => this.debug(`[${context}]`, ...args)
    }
  }
}

export const logger = new Logger()

// Exportar instancias con contexto para áreas específicas
export const forgeLogger = logger.withContext('Forge')
export const apiLogger = logger.withContext('API')
export const authLogger = logger.withContext('Auth')
export const dbLogger = logger.withContext('DB')
