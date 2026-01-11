import { z } from 'zod'

// ============================================
// Chat API Schema
// ============================================

export const ChatMessageSchema = z.object({
  id: z.string().min(1).max(100),
  role: z.enum(['user', 'assistant']),
  content: z.string().min(1).max(50000),
})

export const ChatRequestSchema = z.object({
  messages: z.array(ChatMessageSchema).min(1).max(100),
  phase: z.string().min(1).max(50),
  backgroundDocs: z.object({
    resume: z.string().max(50000).optional(),
    disc: z.string().max(10000).optional(),
    gallup: z.string().max(10000).optional(),
    other: z.string().max(20000).optional(),
  }).optional(),
})

export type ChatRequest = z.infer<typeof ChatRequestSchema>

// ============================================
// Report API Schema
// ============================================

export const PhaseDataSchema = z.object({
  messages: z.array(ChatMessageSchema),
  summary: z.string().optional(),
  completed: z.boolean(),
})

export const ReportRequestSchema = z.object({
  phases: z.record(z.string(), PhaseDataSchema),
  backgroundDocs: z.object({
    resume: z.string().max(50000).optional(),
    disc: z.string().max(10000).optional(),
    gallup: z.string().max(10000).optional(),
    other: z.string().max(20000).optional(),
  }).optional(),
})

export type ReportRequest = z.infer<typeof ReportRequestSchema>

// ============================================
// Email API Schema
// ============================================

export const EmailRequestSchema = z.object({
  email: z.string().email('Invalid email address').max(254),
  name: z.string().max(100).optional(),
  reportHtml: z.string().min(1).max(500000),
  reportMarkdown: z.string().min(1).max(200000),
})

export type EmailRequest = z.infer<typeof EmailRequestSchema>

// ============================================
// Advice API Schema
// ============================================

export const AdviceRequestSchema = z.object({
  name: z.string().min(1, 'Name is required').max(100),
  email: z.string().email('Invalid email address').max(254),
  question: z.string().min(10, 'Question must be at least 10 characters').max(5000),
})

export type AdviceRequest = z.infer<typeof AdviceRequestSchema>

// ============================================
// Progress Email Schema
// ============================================

export const ProgressEmailSchema = z.object({
  email: z.string().email('Invalid email address'),
  name: z.string().min(1).max(100).optional(),
  progress: z.number().min(0).max(100),
  phases: z.record(z.object({
    completed: z.boolean(),
    messageCount: z.number()
  }))
})

export type ProgressEmailRequest = z.infer<typeof ProgressEmailSchema>
