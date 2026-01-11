// ============================================
// Input Sanitization Utilities
// ============================================

/**
 * Escape HTML entities to prevent XSS
 */
export function escapeHtml(text: string): string {
  const htmlEntities: Record<string, string> = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#39;',
  }
  return text.replace(/[&<>"']/g, (char) => htmlEntities[char])
}

/**
 * Sanitize user input for use in prompts
 * Removes potential prompt injection patterns
 */
export function sanitizeForPrompt(input: string): string {
  // Limit length
  const maxLength = 10000
  let sanitized = input.slice(0, maxLength)
  
  // Remove null bytes
  sanitized = sanitized.replace(/\0/g, '')
  
  // Normalize whitespace
  sanitized = sanitized.replace(/\r\n/g, '\n').replace(/\r/g, '\n')
  
  return sanitized.trim()
}

/**
 * Sanitize content for email (more restrictive)
 */
export function sanitizeForEmail(content: string): string {
  // Escape HTML first
  let sanitized = escapeHtml(content)
  
  // Remove any script-like patterns
  sanitized = sanitized.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
  sanitized = sanitized.replace(/javascript:/gi, '')
  sanitized = sanitized.replace(/on\w+\s*=/gi, '')
  
  return sanitized
}

/**
 * Convert markdown to safe HTML for display
 * Basic conversion without external dependencies
 */
export function safeMarkdownToHtml(markdown: string): string {
  let html = escapeHtml(markdown)
  
  // Bold: **text** or __text__
  html = html.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
  html = html.replace(/__(.+?)__/g, '<strong>$1</strong>')
  
  // Italic: *text* or _text_
  html = html.replace(/\*([^*]+)\*/g, '<em>$1</em>')
  html = html.replace(/_([^_]+)_/g, '<em>$1</em>')
  
  // Headers
  html = html.replace(/^### (.+)$/gm, '<h3>$1</h3>')
  html = html.replace(/^## (.+)$/gm, '<h2>$1</h2>')
  html = html.replace(/^# (.+)$/gm, '<h1>$1</h1>')
  
  // Horizontal rules
  html = html.replace(/^---$/gm, '<hr>')
  html = html.replace(/^\*\*\*$/gm, '<hr>')
  
  // Unordered lists
  html = html.replace(/^[-*] (.+)$/gm, '<li>$1</li>')
  html = html.replace(/(<li>.*<\/li>\n?)+/g, '<ul>$&</ul>')
  
  // Ordered lists
  html = html.replace(/^\d+\. (.+)$/gm, '<li>$1</li>')
  
  // Line breaks
  html = html.replace(/\n\n/g, '</p><p>')
  html = html.replace(/\n/g, '<br>')
  
  // Wrap in paragraph
  html = '<p>' + html + '</p>'
  
  // Clean up empty paragraphs
  html = html.replace(/<p>\s*<\/p>/g, '')
  html = html.replace(/<p>\s*<(h[1-6]|ul|ol|hr)/g, '<$1')
  html = html.replace(/<\/(h[1-6]|ul|ol)>\s*<\/p>/g, '</$1>')
  
  return html
}
