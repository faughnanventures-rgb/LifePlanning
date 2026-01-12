import { z } from 'zod'

// Constants for validation limits
const MAX_MESSAGE_CONTENT = 10000  // ~2500 words
const MAX_RESUME_LENGTH = 20000   // ~5000 words
const MAX_MESSAGES = 50           // Reasonable conversation length
const MAX_ID_LENGTH = 50
const MAX_PHASE_LENGTH = 50

export const MessageSchema = z.object({
  id: z.string().min(1).max(MAX_ID_LENGTH),
  role: z.enum(['user', 'assistant']),
  content: z.string().min(1).max(MAX_MESSAGE_CONTENT),
})

export const ChatRequestSchema = z.object({
  messages: z.array(MessageSchema).min(1).max(MAX_MESSAGES),
  phase: z.string().min(1).max(MAX_PHASE_LENGTH),
  mode: z.enum(['quick', 'full']),
  resumeText: z.string().max(MAX_RESUME_LENGTH).optional(),
})

export const PhaseDataSchema = z.object({
  messages: z.array(MessageSchema).max(MAX_MESSAGES),
  completed: z.boolean(),
})

export const ReportRequestSchema = z.object({
  phases: z.record(
    z.string().max(MAX_PHASE_LENGTH), 
    PhaseDataSchema
  ).refine(
    (phases) => Object.keys(phases).length <= 10,
    { message: 'Too many phases' }
  ),
  mode: z.enum(['quick', 'full']),
  resumeText: z.string().max(MAX_RESUME_LENGTH).optional(),
  includeCareer: z.boolean().optional(),
})

export type Message = z.infer<typeof MessageSchema>
export type ChatRequest = z.infer<typeof ChatRequestSchema>
export type ReportRequest = z.infer<typeof ReportRequestSchema>

// Export limits for use in UI validation
export const LIMITS = {
  MAX_MESSAGE_CONTENT,
  MAX_RESUME_LENGTH,
  MAX_MESSAGES,
} as const
