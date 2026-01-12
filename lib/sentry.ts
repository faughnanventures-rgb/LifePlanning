/**
 * Optional Sentry Error Tracking
 * 
 * To enable Sentry:
 * 1. Create a Sentry project at https://sentry.io
 * 2. Add NEXT_PUBLIC_SENTRY_DSN to your environment variables
 * 3. Errors will be automatically reported
 * 
 * For full Sentry features (performance, replays), install the official
 * @sentry/nextjs package and follow their setup guide.
 */

interface SentryConfig {
  dsn: string | undefined
  environment: string
  enabled: boolean
}

export const sentryConfig: SentryConfig = {
  dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,
  environment: process.env.NODE_ENV,
  enabled: !!process.env.NEXT_PUBLIC_SENTRY_DSN,
}

/**
 * Simple error reporter that works without the full Sentry SDK
 * For production, consider using @sentry/nextjs for better integration
 */
export async function reportError(
  error: Error,
  context?: Record<string, unknown>
): Promise<void> {
  // Always log to console
  console.error('Error reported:', error, context)
  
  if (!sentryConfig.enabled || !sentryConfig.dsn) {
    return
  }

  try {
    // Basic Sentry envelope format
    // For full features, use the official SDK
    const eventId = crypto.randomUUID()
    const timestamp = new Date().toISOString()
    
    const event = {
      event_id: eventId,
      timestamp,
      platform: 'javascript',
      environment: sentryConfig.environment,
      exception: {
        values: [{
          type: error.name,
          value: error.message,
          stacktrace: {
            frames: parseStackTrace(error.stack)
          }
        }]
      },
      extra: context,
      tags: {
        runtime: 'nextjs',
      }
    }

    // Extract project ID and key from DSN
    const dsnMatch = sentryConfig.dsn.match(/https:\/\/(.+)@(.+)\.ingest\.sentry\.io\/(\d+)/)
    if (!dsnMatch) {
      console.warn('Invalid Sentry DSN format')
      return
    }

    const [, publicKey, , projectId] = dsnMatch
    const endpoint = `https://sentry.io/api/${projectId}/store/?sentry_key=${publicKey}&sentry_version=7`

    await fetch(endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(event),
    })
  } catch (e) {
    // Don't let error reporting cause more errors
    console.warn('Failed to report error to Sentry:', e)
  }
}

function parseStackTrace(stack?: string): Array<{ filename: string; function: string; lineno: number }> {
  if (!stack) return []
  
  return stack
    .split('\n')
    .slice(1)
    .map(line => {
      const match = line.match(/at\s+(.+?)\s+\((.+?):(\d+):\d+\)/)
      if (match) {
        return {
          function: match[1],
          filename: match[2],
          lineno: parseInt(match[3], 10),
        }
      }
      return null
    })
    .filter((frame): frame is { filename: string; function: string; lineno: number } => frame !== null)
    .reverse()
}

/**
 * Hook for reporting errors in React components
 */
export function useErrorReporter() {
  return {
    reportError: (error: Error, context?: Record<string, unknown>) => {
      reportError(error, context)
    }
  }
}
