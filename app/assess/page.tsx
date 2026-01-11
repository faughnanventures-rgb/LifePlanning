'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import Link from 'next/link'
import { 
  Send, Loader2, ChevronRight, ChevronLeft, Target, 
  MessageSquare, HelpCircle, RotateCcw, FileText, AlertCircle,
  Upload, X, Shield
} from 'lucide-react'
import { cn, generateId } from '@/lib/utils'
import { PHASE_PROMPTS, PHASE_ORDER, getPhaseNumber } from '@/lib/prompts'

interface Message {
  id: string
  role: 'user' | 'assistant'
  content: string
}

interface PhaseData {
  messages: Message[]
  summary?: string
  completed: boolean
}

type PhasesRecord = Record<string, PhaseData>

interface SavedProgress {
  currentPhase: string
  phases: PhasesRecord
  lastUpdated: string
}

interface BackgroundDocuments {
  resume?: string
  disc?: string
  gallup?: string
  other?: string
}

const STORAGE_KEY = 'life-strategy-progress'
const DOCS_STORAGE_KEY = 'life-strategy-background-docs'

export default function AssessPage() {
  const [currentPhase, setCurrentPhase] = useState('current-state')
  const [phases, setPhases] = useState<PhasesRecord>({})
  const [input, setInput] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [showSidebar, setShowSidebar] = useState(true)
  const [overallProgress, setOverallProgress] = useState(0)
  const [isInitialized, setIsInitialized] = useState(false)
  const [showDocsModal, setShowDocsModal] = useState(false)
  const [backgroundDocs, setBackgroundDocs] = useState<BackgroundDocuments>({})
  
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  const currentPhaseData = phases[currentPhase] || { messages: [], completed: false }
  const phaseConfig = PHASE_PROMPTS[currentPhase]

  useEffect(() => {
    let completed = 0
    for (const phase of PHASE_ORDER) {
      const phaseData = phases[phase]
      if (phaseData?.messages && phaseData.messages.length > 1) {
        completed++
      }
    }
    setOverallProgress((completed / PHASE_ORDER.length) * 100)
  }, [phases])

  useEffect(() => {
    if (!isInitialized) return
    
    const phaseData = phases[currentPhase]
    if (!phaseData || phaseData.messages.length === 0) {
      const initialMessage = phaseConfig?.initialMessage
      if (initialMessage) {
        setPhases(prev => ({
          ...prev,
          [currentPhase]: {
            messages: [{
              id: generateId(),
              role: 'assistant',
              content: initialMessage
            }],
            completed: false
          }
        }))
      }
    }
  }, [currentPhase, isInitialized, phases, phaseConfig])

  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY)
      if (saved) {
        const data: SavedProgress = JSON.parse(saved)
        setPhases(data.phases || {})
        setCurrentPhase(data.currentPhase || 'current-state')
      }
      
      const savedDocs = localStorage.getItem(DOCS_STORAGE_KEY)
      if (savedDocs) {
        setBackgroundDocs(JSON.parse(savedDocs))
      }
    } catch (e) {
      console.error('Failed to load saved progress:', e)
    }
    setIsInitialized(true)
  }, [])

  const saveProgress = useCallback((newPhases: PhasesRecord, phase: string) => {
    try {
      const data: SavedProgress = {
        currentPhase: phase,
        phases: newPhases,
        lastUpdated: new Date().toISOString()
      }
      localStorage.setItem(STORAGE_KEY, JSON.stringify(data))
    } catch (e) {
      console.error('Failed to save progress:', e)
    }
  }, [])

  const saveBackgroundDocs = (docs: BackgroundDocuments) => {
    setBackgroundDocs(docs)
    try {
      localStorage.setItem(DOCS_STORAGE_KEY, JSON.stringify(docs))
    } catch (e) {
      console.error('Failed to save background docs:', e)
    }
  }

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [currentPhaseData.messages])

  const sendMessage = async () => {
    if (!input.trim() || isLoading) return

    const userMessage: Message = {
      id: generateId(),
      role: 'user',
      content: input.trim()
    }

    const updatedMessages = [...currentPhaseData.messages, userMessage]
    const newPhases = {
      ...phases,
      [currentPhase]: {
        ...currentPhaseData,
        messages: updatedMessages
      }
    }
    
    setPhases(newPhases)
    setInput('')
    setIsLoading(true)
    setError(null)

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: updatedMessages,
          phase: currentPhase,
          backgroundDocs: backgroundDocs
        })
      })

      if (response.status === 429) {
        const data = await response.json()
        setError(`Too many requests. Please wait ${data.retryAfter || 60} seconds.`)
        return
      }

      if (!response.ok) {
        throw new Error('Failed to get response')
      }

      const data = await response.json()
      
      const assistantMessage: Message = {
        id: generateId(),
        role: 'assistant',
        content: data.reply
      }

      const finalMessages = [...updatedMessages, assistantMessage]
      const finalPhases = {
        ...phases,
        [currentPhase]: {
          messages: finalMessages,
          completed: finalMessages.length >= 6
        }
      }
      
      setPhases(finalPhases)
      saveProgress(finalPhases, currentPhase)

    } catch (err) {
      console.error('Chat error:', err)
      setError('Failed to get response. Please try again.')
      setPhases(prev => ({
        ...prev,
        [currentPhase]: {
          ...currentPhaseData,
          messages: updatedMessages
        }
      }))
    } finally {
      setIsLoading(false)
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      sendMessage()
    }
  }

  const goToPreviousPhase = () => {
    const currentIndex = PHASE_ORDER.indexOf(currentPhase as typeof PHASE_ORDER[number])
    if (currentIndex > 0) {
      setCurrentPhase(PHASE_ORDER[currentIndex - 1])
    }
    setError(null)
  }

  const goToNextPhase = () => {
    const currentIndex = PHASE_ORDER.indexOf(currentPhase as typeof PHASE_ORDER[number])
    if (currentIndex < PHASE_ORDER.length - 1) {
      setCurrentPhase(PHASE_ORDER[currentIndex + 1])
    }
    setError(null)
  }

  const resetProgress = () => {
    if (confirm('Are you sure you want to reset all progress? This cannot be undone.')) {
      try {
        localStorage.removeItem(STORAGE_KEY)
        localStorage.removeItem(DOCS_STORAGE_KEY)
        localStorage.removeItem('life-strategy-report')
        setPhases({})
        setBackgroundDocs({})
        setCurrentPhase('current-state')
        setError(null)
      } catch (e) {
        console.error('Failed to reset progress:', e)
      }
    }
  }

  const phaseNumber = getPhaseNumber(currentPhase)
  const totalPhases = PHASE_ORDER.length

  if (!isInitialized) {
    return (
      <div className="h-screen flex items-center justify-center bg-stone-50">
        <Loader2 className="w-8 h-8 animate-spin text-sage-400" />
      </div>
    )
  }

  return (
    <div className="h-screen flex flex-col sm:flex-row bg-stone-50">
      {overallProgress >= 75 && (
        <div className="fixed bottom-20 sm:bottom-4 left-1/2 -translate-x-1/2 z-50">
          <Link
            href="/report"
            className="flex items-center gap-3 px-5 py-3 bg-teal-700 text-white rounded-full 
                       shadow-lg hover:bg-teal-800 transition-all hover:shadow-xl text-sm sm:text-base"
          >
            <FileText className="w-5 h-5" />
            <span className="font-medium">
              {overallProgress >= 100 ? 'Your report is ready!' : 'Draft report ready'}
            </span>
            <ChevronRight className="w-4 h-4" />
          </Link>
        </div>
      )}
      
      {showSidebar && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 sm:hidden"
          onClick={() => setShowSidebar(false)}
        />
      )}

      <div className={cn(
        "fixed sm:relative inset-y-0 left-0 z-50 w-72 bg-white border-r border-stone-200 flex flex-col transform transition-transform sm:transform-none",
        showSidebar ? "translate-x-0" : "-translate-x-full sm:translate-x-0"
      )}>
        <div className="p-4 border-b border-stone-200">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-8 h-8 bg-sage-400 rounded-lg flex items-center justify-center">
              <Target className="w-5 h-5 text-white" />
            </div>
            <span className="font-semibold text-stone-700">Life Strategy</span>
            <span className="px-1.5 py-0.5 bg-amber-100 text-amber-700 text-[10px] font-medium rounded">
              BETA
            </span>
          </Link>
        </div>

        <div className="flex-1 overflow-y-auto p-4">
          <div className="space-y-1">
            {PHASE_ORDER.map((phase, index) => {
              const config = PHASE_PROMPTS[phase]
              const phaseData = phases[phase]
              const hasMessages = phaseData?.messages && phaseData.messages.length > 1
              const isActive = phase === currentPhase
              
              return (
                <button
                  key={phase}
                  onClick={() => setCurrentPhase(phase)}
                  className={cn(
                    "w-full text-left px-3 py-2 rounded-lg text-sm transition-colors flex items-center gap-2",
                    isActive 
                      ? "bg-sage-100 text-sage-700" 
                      : "hover:bg-stone-100 text-stone-600"
                  )}
                >
                  <span className={cn(
                    "w-5 h-5 rounded-full flex items-center justify-center text-xs font-medium",
                    hasMessages ? "bg-sage-400 text-white" : "bg-stone-200 text-stone-500"
                  )}>
                    {index + 1}
                  </span>
                  <span className="flex-1 truncate">{config?.title || phase}</span>
                </button>
              )
            })}
          </div>
          
          {/* AI Disclaimer in sidebar */}
          <div className="mt-4 p-3 bg-stone-50 rounded-lg border border-stone-200">
            <div className="flex items-start gap-2">
              <Shield className="w-4 h-4 text-stone-400 flex-shrink-0 mt-0.5" />
              <p className="text-xs text-stone-500">
                This is an AI tool for reflection, not professional advice. AI can make mistakes.
              </p>
            </div>
          </div>
        </div>

        <div className="p-4 border-t border-stone-200 space-y-2">
          {overallProgress > 0 && (
            <div className="mb-3">
              <div className="flex justify-between text-xs text-stone-500 mb-1">
                <span>Progress</span>
                <span>{Math.round(overallProgress)}%</span>
              </div>
              <div className="h-1.5 bg-stone-200 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-sage-400 rounded-full transition-all duration-300"
                  style={{ width: `${overallProgress}%` }}
                />
              </div>
            </div>
          )}
          
          <Link 
            href="/advice"
            className="flex items-center gap-2 px-3 py-2 text-sm text-stone-600 hover:bg-stone-100 rounded-lg"
          >
            <HelpCircle className="w-4 h-4" />
            Ask for Advice
          </Link>
          
          <button 
            onClick={() => setShowDocsModal(true)}
            className="flex items-center gap-2 px-3 py-2 text-sm text-stone-600 hover:bg-stone-100 rounded-lg w-full"
          >
            <Upload className="w-4 h-4" />
            <span className="flex-1 text-left">Background Docs</span>
            {(backgroundDocs.resume || backgroundDocs.disc || backgroundDocs.gallup) && (
              <span className="w-2 h-2 bg-sage-400 rounded-full" />
            )}
          </button>
          
          <button 
            onClick={resetProgress}
            className="flex items-center gap-2 px-3 py-2 text-sm text-stone-500 hover:bg-stone-100 rounded-lg w-full"
          >
            <RotateCcw className="w-4 h-4" />
            Reset Progress
          </button>
        </div>
      </div>

      <div className="flex-1 flex flex-col min-w-0">
        <header className="flex-shrink-0 border-b border-stone-200 bg-white px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button
                onClick={() => setShowSidebar(!showSidebar)}
                className="p-2 hover:bg-stone-100 rounded-lg sm:hidden"
              >
                <MessageSquare className="w-5 h-5 text-stone-500" />
              </button>
              <div>
                <div className="flex items-center gap-2 text-sm text-stone-500 mb-1">
                  <span>Phase {phaseNumber} of {totalPhases}</span>
                </div>
                <h1 className="text-xl font-semibold text-stone-700">
                  {phaseConfig?.title || currentPhase}
                </h1>
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              <button
                onClick={goToPreviousPhase}
                disabled={phaseNumber === 1}
                className="p-2 rounded-lg hover:bg-stone-100 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <ChevronLeft className="w-5 h-5 text-stone-500" />
              </button>
              <button
                onClick={goToNextPhase}
                disabled={phaseNumber === totalPhases}
                className="p-2 rounded-lg hover:bg-stone-100 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <ChevronRight className="w-5 h-5 text-stone-500" />
              </button>
            </div>
          </div>
        </header>

        <div className="flex-1 overflow-y-auto p-6">
          <div className="max-w-2xl mx-auto space-y-6">
            {currentPhaseData.messages.map((message) => (
              <div
                key={message.id}
                className={cn(
                  "flex",
                  message.role === 'user' ? "justify-end" : "justify-start"
                )}
              >
                <div
                  className={cn(
                    "max-w-[85%] rounded-2xl px-4 py-3",
                    message.role === 'user'
                      ? "bg-sage-400 text-white"
                      : "bg-white border border-stone-200 text-stone-700"
                  )}
                >
                  <div className="whitespace-pre-wrap text-sm leading-relaxed">
                    {message.content}
                  </div>
                </div>
              </div>
            ))}
            
            {isLoading && (
              <div className="flex justify-start">
                <div className="bg-white border border-stone-200 rounded-2xl px-4 py-3">
                  <Loader2 className="w-5 h-5 animate-spin text-sage-400" />
                </div>
              </div>
            )}
            
            <div ref={messagesEndRef} />
          </div>
        </div>

        {error && (
          <div className="px-6 py-3 bg-red-50 border-t border-red-200">
            <div className="max-w-2xl mx-auto flex items-center gap-2 text-red-700 text-sm">
              <AlertCircle className="w-4 h-4" />
              {error}
            </div>
          </div>
        )}

        <div className="flex-shrink-0 border-t border-stone-200 bg-white p-4">
          <div className="max-w-2xl mx-auto">
            <div className="flex gap-3">
              <textarea
                ref={textareaRef}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Type your response..."
                rows={2}
                className="flex-1 resize-none rounded-xl border border-stone-200 px-4 py-3 
                           focus:outline-none focus:border-sage-400 focus:ring-2 focus:ring-sage-100"
              />
              <button
                onClick={sendMessage}
                disabled={!input.trim() || isLoading}
                className="self-end px-4 py-3 bg-sage-400 text-white rounded-xl 
                           hover:bg-sage-500 disabled:bg-stone-300 disabled:cursor-not-allowed
                           transition-colors"
              >
                <Send className="w-5 h-5" />
              </button>
            </div>
            <p className="text-xs text-stone-400 mt-2 text-center">
              Press Enter to send, Shift+Enter for new line
            </p>
          </div>
        </div>
      </div>

      {/* Background Docs Modal */}
      {showDocsModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl w-full max-w-2xl max-h-[80vh] overflow-hidden flex flex-col">
            <div className="p-4 border-b border-stone-200 flex items-center justify-between">
              <div>
                <h2 className="text-lg font-semibold text-stone-700">Background Documents</h2>
                <p className="text-sm text-stone-500">Add context to get more personalized guidance</p>
              </div>
              <button
                onClick={() => setShowDocsModal(false)}
                className="p-2 hover:bg-stone-100 rounded-lg"
              >
                <X className="w-5 h-5 text-stone-500" />
              </button>
            </div>
            
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              <div>
                <label className="block text-sm font-medium text-stone-700 mb-2">
                  Resume / CV <span className="text-stone-400 font-normal">(optional)</span>
                </label>
                <textarea
                  value={backgroundDocs.resume || ''}
                  onChange={(e) => saveBackgroundDocs({ ...backgroundDocs, resume: e.target.value })}
                  placeholder="Paste your resume content here..."
                  className="w-full h-32 px-3 py-2 text-sm border border-stone-200 rounded-lg 
                             focus:outline-none focus:border-sage-400 resize-none"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-stone-700 mb-2">
                  DISC Assessment <span className="text-stone-400 font-normal">(optional)</span>
                </label>
                <textarea
                  value={backgroundDocs.disc || ''}
                  onChange={(e) => saveBackgroundDocs({ ...backgroundDocs, disc: e.target.value })}
                  placeholder="e.g., High D (78), High I (65), Low S (32), Moderate C (45)..."
                  className="w-full h-24 px-3 py-2 text-sm border border-stone-200 rounded-lg 
                             focus:outline-none focus:border-sage-400 resize-none"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-stone-700 mb-2">
                  Gallup StrengthsFinder <span className="text-stone-400 font-normal">(optional)</span>
                </label>
                <textarea
                  value={backgroundDocs.gallup || ''}
                  onChange={(e) => saveBackgroundDocs({ ...backgroundDocs, gallup: e.target.value })}
                  placeholder="e.g., 1. Strategic, 2. Learner, 3. Achiever..."
                  className="w-full h-24 px-3 py-2 text-sm border border-stone-200 rounded-lg 
                             focus:outline-none focus:border-sage-400 resize-none"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-stone-700 mb-2">
                  Other Background <span className="text-stone-400 font-normal">(optional)</span>
                </label>
                <textarea
                  value={backgroundDocs.other || ''}
                  onChange={(e) => saveBackgroundDocs({ ...backgroundDocs, other: e.target.value })}
                  placeholder="Any additional context..."
                  className="w-full h-24 px-3 py-2 text-sm border border-stone-200 rounded-lg 
                             focus:outline-none focus:border-sage-400 resize-none"
                />
              </div>
            </div>
            
            <div className="p-4 border-t border-stone-200 flex items-center justify-between">
              <button
                onClick={() => {
                  if (confirm('Clear all background documents?')) {
                    saveBackgroundDocs({})
                  }
                }}
                className="text-sm text-stone-500 hover:text-red-600"
              >
                Clear All
              </button>
              <button
                onClick={() => setShowDocsModal(false)}
                className="px-4 py-2 bg-sage-400 text-white rounded-lg hover:bg-sage-500 text-sm font-medium"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
