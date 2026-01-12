import { Resend } from 'resend'

interface AlertOptions {
  type: 'error' | 'warning' | 'info'
  title: string
  message: string
  metadata?: Record<string, unknown>
  stack?: string
}

interface AlertConfig {
  slackWebhook?: string
  discordWebhook?: string
  alertEmail?: string
  resendApiKey?: string
  fromEmail?: string
  enabled: boolean
}

function getConfig(): AlertConfig {
  return {
    slackWebhook: process.env.SLACK_WEBHOOK_URL,
    discordWebhook: process.env.DISCORD_WEBHOOK_URL,
    alertEmail: process.env.ALERT_EMAIL,
    resendApiKey: process.env.RESEND_API_KEY,
    fromEmail: process.env.FROM_EMAIL || 'alerts@example.com',
    enabled: process.env.NODE_ENV === 'production' || process.env.ENABLE_ALERTS === 'true',
  }
}

export async function sendAlert(options: AlertOptions): Promise<void> {
  const config = getConfig()
  
  // Always log to console
  const logMethod = options.type === 'error' ? console.error : console.log
  logMethod(`[ALERT][${options.type.toUpperCase()}] ${options.title}:`, options.message)
  
  if (!config.enabled) {
    return
  }
  
  const promises: Promise<void>[] = []
  
  // Send to Slack
  if (config.slackWebhook) {
    promises.push(sendSlackAlert(config.slackWebhook, options))
  }
  
  // Send to Discord
  if (config.discordWebhook) {
    promises.push(sendDiscordAlert(config.discordWebhook, options))
  }
  
  // Send email
  if (config.alertEmail && config.resendApiKey) {
    promises.push(sendEmailAlert(config, options))
  }
  
  // Fire and forget - don't block on alerts
  await Promise.allSettled(promises)
}

async function sendSlackAlert(webhookUrl: string, options: AlertOptions): Promise<void> {
  try {
    const color = options.type === 'error' ? '#dc2626' : options.type === 'warning' ? '#f59e0b' : '#3b82f6'
    
    await fetch(webhookUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        attachments: [{
          color,
          title: `[${options.type.toUpperCase()}] ${options.title}`,
          text: options.message,
          fields: options.metadata ? Object.entries(options.metadata).map(([key, value]) => ({
            title: key,
            value: String(value),
            short: true,
          })) : undefined,
          footer: 'Life Strategy Planner',
          ts: Math.floor(Date.now() / 1000),
        }],
      }),
    })
  } catch (error) {
    console.error('Failed to send Slack alert:', error)
  }
}

async function sendDiscordAlert(webhookUrl: string, options: AlertOptions): Promise<void> {
  try {
    const color = options.type === 'error' ? 0xdc2626 : options.type === 'warning' ? 0xf59e0b : 0x3b82f6
    
    await fetch(webhookUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        embeds: [{
          title: `[${options.type.toUpperCase()}] ${options.title}`,
          description: options.message,
          color,
          fields: options.metadata ? Object.entries(options.metadata).map(([key, value]) => ({
            name: key,
            value: String(value),
            inline: true,
          })) : undefined,
          footer: {
            text: 'Life Strategy Planner',
          },
          timestamp: new Date().toISOString(),
        }],
      }),
    })
  } catch (error) {
    console.error('Failed to send Discord alert:', error)
  }
}

async function sendEmailAlert(config: AlertConfig, options: AlertOptions): Promise<void> {
  try {
    const resend = new Resend(config.resendApiKey)
    
    const subject = `[${options.type.toUpperCase()}] ${options.title}`
    const metadataHtml = options.metadata 
      ? `<h3>Metadata:</h3><pre>${JSON.stringify(options.metadata, null, 2)}</pre>`
      : ''
    const stackHtml = options.stack
      ? `<h3>Stack Trace:</h3><pre style="background:#f3f4f6;padding:12px;overflow-x:auto;">${options.stack}</pre>`
      : ''
    
    await resend.emails.send({
      from: config.fromEmail!,
      to: config.alertEmail!,
      subject,
      html: `
        <div style="font-family: sans-serif; max-width: 600px;">
          <h2 style="color: ${options.type === 'error' ? '#dc2626' : options.type === 'warning' ? '#f59e0b' : '#3b82f6'}">
            ${options.title}
          </h2>
          <p style="font-size: 16px; color: #374151;">${options.message}</p>
          ${metadataHtml}
          ${stackHtml}
          <hr style="margin: 24px 0; border: none; border-top: 1px solid #e5e7eb;">
          <p style="color: #6b7280; font-size: 12px;">
            Life Strategy Planner Alert • ${new Date().toISOString()}
          </p>
        </div>
      `,
    })
  } catch (error) {
    console.error('Failed to send email alert:', error)
  }
}

// Convenience methods
export const alertError = (title: string, message: string, metadata?: Record<string, unknown>) =>
  sendAlert({ type: 'error', title, message, metadata })

export const alertWarning = (title: string, message: string, metadata?: Record<string, unknown>) =>
  sendAlert({ type: 'warning', title, message, metadata })

export const alertInfo = (title: string, message: string, metadata?: Record<string, unknown>) =>
  sendAlert({ type: 'info', title, message, metadata })

// Error helper that extracts stack
export async function alertException(error: unknown, context?: string): Promise<void> {
  const err = error instanceof Error ? error : new Error(String(error))
  
  await sendAlert({
    type: 'error',
    title: context || 'Unhandled Exception',
    message: err.message,
    stack: err.stack,
    metadata: {
      name: err.name,
      timestamp: new Date().toISOString(),
    },
  })
}
