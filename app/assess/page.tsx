'use client'

import { useState, useEffect, useRef, useCallback, Suspense } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import { useSession } from 'next-auth/react'
import Link from 'next/link'
import { 
  Send, Loader2, ChevronRight, ChevronLeft, Target, 
  Menu, X, FileText, Upload, Briefcase, ArrowUp, User, Sparkles, Check, Cloud
} from 'lucide-react'
import { cn, generateId } from '@/lib/utils'
import { QUICK_PHASES, FULL_PHASES, type PhaseConfig } from '@/lib/prompts'
import { Celebration } from '@/components/Celebration'

interface Message {
  id: string
  role: 'user' | 'assistant'
  content: string
}

interface PhaseData {
  messages: Message[]
  completed: boolean
}

type PhasesRecord = Record<string, PhaseData>

const STORAGE_KEY = 'life-strategy-progress-v2'
const ONBOARDING_KEY = 'life-strategy-onboarded-v1'

function AssessmentContent() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const { data: session, status } = useSession()
  const initialMode = searchParams.get('mode') === 'full' ? 'full' : 'quick'
  
  const [mode, setMode] = useState<'quick' | 'full'>(initialMode)
  const [phases, setPhases] = useState<PhasesRecord>({})
  const [currentPhaseIndex, setCurrentPhaseIndex] = useState(0)
  const [input, setInput] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [showSidebar, setShowSidebar] = useState(false)
  const [isInitialized, setIsInitialized] = useState(false)
  const [resumeText, setResumeText] = useState('')
  const [showResumeModal, setShowResumeModal] = useState(false)
  const [includeCareer, setIncludeCareer] = useState(true)
  const [celebration, setCelebration] = useState<{
    type: 'phase-complete' | 'milestone' | 'report-ready'
    message?: string
  } | null>(null)
  const [saveStatus, setSaveStatus] = useState<'saved' | 'saving' | 'idle'>('idle')
  
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  // Redirect to onboarding if first time, or login if not authenticated
  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login?callbackUrl=/assess')
    } else if (status === 'authenticated') {
      const hasOnboarded = localStorage.getItem(ONBOARDING_KEY)
      if (!hasOnboarded && !searchParams.get('skip_onboarding')) {
        router.push('/onboarding')
      }
    }
  }, [status, router, searchParams])

  const phasesList: PhaseConfig[] = mode === 'quick' 
    ? QUICK_PHASES 
    : includeCareer 
      ? FULL_PHASES 
      : FULL_PHASES.filter(p => p.id !== 'career')

  const currentPhase = phasesList[currentPhaseIndex]
  const currentPhaseData = phases[currentPhase?.id] || { messages: [], completed: false }

  // Calculate progress
  const completedCount = phasesList.filter(p => {
    const data = phases[p.id]
    return data && data.messages.length >= p.minExchanges * 2
  }).length
  const progress = (completedCount / phasesList.length) * 100

  // Load saved progress
  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY)
      if (saved) {
        const data = JSON.parse(saved)
        setPhases(data.phases || {})
        setMode(data.mode || 'quick')
        setResumeText(data.resumeText || '')
        setIncludeCareer(data.includeCareer !== false)
      }
    } catch (e) {
      console.error('Failed to load progress:', e)
    }
    setIsInitialized(true)
  }, [])

  // Warn user before closing/navigating away
  useEffect(() => {
    const hasProgress = Object.values(phases).some(p => p.messages.length > 1)
    
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      // Only warn if they have progress and haven't completed everything
      if (hasProgress && progress < 100) {
        e.preventDefault()
        // Modern browsers ignore custom messages, but we need to set returnValue
        e.returnValue = ''
        return ''
      }
    }

    window.addEventListener('beforeunload', handleBeforeUnload)
    return () => window.removeEventListener('beforeunload', handleBeforeUnload)
  }, [phases, progress])

  // Initialize current phase with initial message
  useEffect(() => {
    if (!isInitialized || !currentPhase) return
    
    if (!phases[currentPhase.id] || phases[currentPhase.id].messages.length === 0) {
      setPhases(prev => ({
        ...prev,
        [currentPhase.id]: {
          messages: [{
            id: generateId(),
            role: 'assistant',
            content: currentPhase.initialMessage
          }],
          completed: false
        }
      }))
    }
  }, [currentPhaseIndex, isInitialized, currentPhase, phases])

  // Save progress
  const saveProgress = useCallback((newPhases: PhasesRecord) => {
    setSaveStatus('saving')
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify({
        phases: newPhases,
        mode,
        resumeText,
        includeCareer,
        lastUpdated: new Date().toISOString()
      }))
      setSaveStatus('saved')
      // Reset to idle after 2 seconds
      setTimeout(() => setSaveStatus('idle'), 2000)
    } catch (e) {
      console.error('Failed to save:', e)
      setSaveStatus('idle')
    }
  }, [mode, resumeText, includeCareer])

  // Auto-scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [currentPhaseData.messages])

  const sendMessage = async () => {
    if (!input.trim() || isLoading || !currentPhase) return

    const userMessage: Message = {
      id: generateId(),
      role: 'user',
      content: input.trim()
    }

    const updatedMessages = [...currentPhaseData.messages, userMessage]
    const newPhases = {
      ...phases,
      [currentPhase.id]: { ...currentPhaseData, messages: updatedMessages }
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
          phase: currentPhase.id,
          mode,
          resumeText: currentPhase.id === 'career' ? resumeText : undefined
        })
      })

      if (response.status === 429) {
        setError('Too many requests. Please wait a moment.')
        return
      }

      if (!response.ok) throw new Error('Failed to get response')

      const data = await response.json()
      
      const assistantMessage: Message = {
        id: generateId(),
        role: 'assistant',
        content: data.reply
      }

      const finalMessages = [...updatedMessages, assistantMessage]
      const wasCompleted = currentPhaseData.completed
      const isCompleted = finalMessages.length >= currentPhase.minExchanges * 2
      const finalPhases = {
        ...phases,
        [currentPhase.id]: { messages: finalMessages, completed: isCompleted }
      }
      
      setPhases(finalPhases)
      saveProgress(finalPhases)

      // Trigger celebration on phase completion
      if (isCompleted && !wasCompleted) {
        const completedPhasesCount = Object.values(finalPhases).filter(p => p.completed).length
        const totalPhases = phasesList.length
        
        if (completedPhasesCount === totalPhases) {
          // All phases complete!
          setCelebration({ type: 'report-ready', message: 'Your strategic plan is ready!' })
        } else if (completedPhasesCount === Math.floor(totalPhases / 2)) {
          // Halfway milestone
          setCelebration({ type: 'milestone', message: "Halfway there! You're doing great." })
        } else {
          // Regular phase complete
          setCelebration({ type: 'phase-complete', message: `${currentPhase.title} complete!` })
        }
      }

    } catch (err) {
      console.error('Chat error:', err)
      setError('Failed to get response. Please try again.')
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

  const goToPhase = (index: number) => {
    if (index >= 0 && index < phasesList.length) {
      setCurrentPhaseIndex(index)
      setShowSidebar(false)
      setError(null)
    }
  }

  const upgradeToFull = () => {
    setMode('full')
    localStorage.setItem(STORAGE_KEY, JSON.stringify({
      phases,
      mode: 'full',
      resumeText,
      includeCareer,
      lastUpdated: new Date().toISOString()
    }))
  }

  const resetProgress = () => {
    if (confirm('Reset all progress? This cannot be undone.')) {
      localStorage.removeItem(STORAGE_KEY)
      localStorage.removeItem('life-strategy-report-v2')
      setPhases({})
      setCurrentPhaseIndex(0)
      setResumeText('')
    }
  }

  // Show loading while checking auth or initializing
  if (status === 'loading' || !isInitialized) {
    return (
      <div className="h-screen flex items-center justify-center bg-stone-50">
        <Loader2 className="w-8 h-8 animate-spin text-sage-400" />
      </div>
    )
  }

  // Don't render if not authenticated (redirect happens in useEffect)
  if (!session) {
    return (
      <div className="h-screen flex items-center justify-center bg-stone-50">
        <Loader2 className="w-8 h-8 animate-spin text-sage-400" />
      </div>
    )
  }

  return (
    <div className="h-screen flex flex-col bg-stone-50">
      {/* Celebration Modal */}
      {celebration && (
        <Celebration
          type={celebration.type}
          message={celebration.message}
          onClose={() => setCelebration(null)}
        />
      )}

      {/* Report Ready Banner */}
      {progress >= 75 && (
        <div className="bg-teal-600 text-white px-4 py-2 text-center text-sm">
          <Link href={`/report?mode=${mode}`} className="hover:underline font-medium flex items-center justify-center gap-2">
            <Sparkles className="w-4 h-4" />
            Your {progress >= 100 ? 'report is ready' : 'draft report is available'}! Click to view →
          </Link>
        </div>
      )}

      {/* Header */}
      <header className="flex-shrink-0 border-b border-stone-200 bg-white px-3 sm:px-4 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setShowSidebar(true)}
              className="p-2 hover:bg-stone-100 rounded-lg lg:hidden"
            >
              <Menu className="w-5 h-5 text-stone-500" />
            </button>
            <Link href="/" className="flex items-center gap-2">
              <div className="w-8 h-8 bg-sage-400 rounded-lg flex items-center justify-center">
                <Target className="w-4 h-4 text-white" />
              </div>
              <span className="font-semibold text-stone-700 hidden sm:inline">Life Strategy</span>
            </Link>
          </div>
          
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Save Status */}
            {saveStatus !== 'idle' && (
              <span className={cn(
                "flex items-center gap-1 text-xs transition-opacity",
                saveStatus === 'saved' ? "text-green-600" : "text-stone-400"
              )}>
                {saveStatus === 'saving' ? (
                  <>
                    <Cloud className="w-3 h-3 animate-pulse" />
                    <span className="hidden sm:inline">Saving...</span>
                  </>
                ) : (
                  <>
                    <Check className="w-3 h-3" />
                    <span className="hidden sm:inline">Saved</span>
                  </>
                )}
              </span>
            )}
            <span className="text-sm text-stone-500 hidden sm:inline">
              {mode === 'quick' ? 'Quick' : 'Full'} • Phase {currentPhaseIndex + 1}/{phasesList.length}
            </span>
            <div className="w-20 sm:w-24 h-2 bg-stone-200 rounded-full overflow-hidden">
              <div 
                className="h-full bg-sage-400 transition-all"
                style={{ width: `${progress}%` }}
              />
            </div>
            {/* User Menu */}
            <Link 
              href="/account"
              className="p-2 hover:bg-stone-100 rounded-lg"
              title={session.user?.email || 'Account'}
            >
              <User className="w-5 h-5 text-stone-500" />
            </Link>
          </div>
        </div>
      </header>

      <div className="flex-1 flex overflow-hidden">
        {/* Sidebar Overlay */}
        {showSidebar && (
          <div 
            className="fixed inset-0 bg-black/50 z-40 lg:hidden"
            onClick={() => setShowSidebar(false)}
          />
        )}

        {/* Sidebar */}
        <aside className={cn(
          "fixed lg:relative inset-y-0 left-0 z-50 w-72 bg-white border-r border-stone-200 flex flex-col transform transition-transform lg:transform-none",
          showSidebar ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        )}>
          <div className="p-4 border-b border-stone-200 flex items-center justify-between">
            <span className="font-semibold text-stone-700">
              {mode === 'quick' ? 'Quick Clarity' : 'Full Assessment'}
            </span>
            <button onClick={() => setShowSidebar(false)} className="lg:hidden">
              <X className="w-5 h-5 text-stone-400" />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto p-3">
            <div className="space-y-1">
              {phasesList.map((phase, index) => {
                const data = phases[phase.id]
                const hasStarted = data && data.messages.length > 1
                const isComplete = data && data.messages.length >= phase.minExchanges * 2
                const isActive = index === currentPhaseIndex
                
                return (
                  <button
                    key={phase.id}
                    onClick={() => goToPhase(index)}
                    className={cn(
                      "w-full text-left px-3 py-2.5 rounded-lg text-sm transition-colors flex items-center gap-2",
                      isActive ? "bg-sage-100 text-sage-700" : "hover:bg-stone-100 text-stone-600"
                    )}
                  >
                    <span className={cn(
                      "w-6 h-6 rounded-full flex items-center justify-center text-xs font-medium flex-shrink-0",
                      isComplete ? "bg-sage-400 text-white" :
                      hasStarted ? "bg-sage-200 text-sage-700" :
                      "bg-stone-200 text-stone-500"
                    )}>
                      {index + 1}
                    </span>
                    <span className="truncate">{phase.title}</span>
                    {phase.id === 'career' && (
                      <Briefcase className="w-3 h-3 text-amber-500 ml-auto" />
                    )}
                  </button>
                )
              })}
            </div>

            {/* Mode upgrade */}
            {mode === 'quick' && (
              <div className="mt-6 p-3 bg-teal-50 rounded-lg border border-teal-100">
                <div className="flex items-center gap-2 mb-2">
                  <ArrowUp className="w-4 h-4 text-teal-600" />
                  <span className="text-sm font-medium text-teal-700">Want more depth?</span>
                </div>
                <p className="text-xs text-teal-600 mb-3">
                  Upgrade to Full Assessment. Your progress carries over.
                </p>
                <button
                  onClick={upgradeToFull}
                  className="w-full py-2 bg-teal-600 text-white text-sm rounded-lg hover:bg-teal-700"
                >
                  Upgrade to Full
                </button>
              </div>
            )}

            {/* Career module toggle */}
            {mode === 'full' && (
              <div className="mt-4 p-3 bg-amber-50 rounded-lg border border-amber-100">
                <label className="flex items-start gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={includeCareer}
                    onChange={(e) => setIncludeCareer(e.target.checked)}
                    className="mt-1"
                  />
                  <div>
                    <span className="text-sm font-medium text-amber-700">Career Module</span>
                    <p className="text-xs text-amber-600">Include career exploration questions</p>
                  </div>
                </label>
              </div>
            )}
          </div>

          <div className="p-3 border-t border-stone-200 space-y-2">
            {mode === 'full' && (
              <button
                onClick={() => setShowResumeModal(true)}
                className="flex items-center gap-2 w-full px-3 py-2 text-sm text-stone-600 hover:bg-stone-100 rounded-lg"
              >
                <Upload className="w-4 h-4" />
                <span>Upload Resume</span>
                {resumeText && <span className="ml-auto w-2 h-2 bg-sage-400 rounded-full" />}
              </button>
            )}
            <button
              onClick={resetProgress}
              className="flex items-center gap-2 w-full px-3 py-2 text-sm text-stone-500 hover:bg-stone-100 rounded-lg"
            >
              Reset Progress
            </button>
          </div>
        </aside>

        {/* Main Chat Area */}
        <main className="flex-1 flex flex-col min-w-0">
          {/* Phase Header */}
          <div className="flex-shrink-0 px-4 py-3 bg-white border-b border-stone-200">
            <div className="flex items-center justify-between max-w-2xl mx-auto">
              <div>
                <h1 className="font-semibold text-stone-700">{currentPhase?.title}</h1>
                <p className="text-sm text-stone-500">{currentPhase?.description}</p>
              </div>
              <div className="flex items-center gap-1">
                <button
                  onClick={() => goToPhase(currentPhaseIndex - 1)}
                  disabled={currentPhaseIndex === 0}
                  className="p-2 hover:bg-stone-100 rounded-lg disabled:opacity-30"
                >
                  <ChevronLeft className="w-5 h-5 text-stone-500" />
                </button>
                <button
                  onClick={() => goToPhase(currentPhaseIndex + 1)}
                  disabled={currentPhaseIndex === phasesList.length - 1}
                  className="p-2 hover:bg-stone-100 rounded-lg disabled:opacity-30"
                >
                  <ChevronRight className="w-5 h-5 text-stone-500" />
                </button>
              </div>
            </div>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4">
            <div className="max-w-2xl mx-auto space-y-4">
              {currentPhaseData.messages.map((msg) => (
                <div
                  key={msg.id}
                  className={cn(
                    "flex",
                    msg.role === 'user' ? "justify-end" : "justify-start"
                  )}
                >
                  <div className={cn(
                    "max-w-[85%] rounded-2xl px-4 py-3 text-sm",
                    msg.role === 'user'
                      ? "bg-sage-400 text-white"
                      : "bg-white border border-stone-200 text-stone-700"
                  )}>
                    <div className="whitespace-pre-wrap leading-relaxed">
                      {msg.content}
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

          {/* Error */}
          {error && (
            <div className="px-4 py-2 bg-red-50 text-red-700 text-sm text-center">
              {error}
            </div>
          )}

          {/* Input */}
          <div className="flex-shrink-0 p-4 bg-white border-t border-stone-200">
            <div className="max-w-2xl mx-auto">
              <div className="flex gap-3">
                <textarea
                  ref={textareaRef}
                  value={input}
                  onChange={(e) => setInput(e.target.value.slice(0, 10000))}
                  onKeyDown={handleKeyDown}
                  placeholder="Type your response..."
                  rows={2}
                  maxLength={10000}
                  className="flex-1 resize-none rounded-xl border border-stone-200 px-4 py-3 text-sm
                             focus:outline-none focus:border-sage-400"
                />
                <button
                  onClick={sendMessage}
                  disabled={!input.trim() || isLoading}
                  className="self-end px-4 py-3 bg-sage-400 text-white rounded-xl 
                             hover:bg-sage-500 disabled:bg-stone-300 transition-colors"
                >
                  <Send className="w-5 h-5" />
                </button>
              </div>
              {input.length > 8000 && (
                <p className={cn(
                  "text-xs mt-1 text-right",
                  input.length > 9500 ? "text-red-500" : "text-amber-500"
                )}>
                  {input.length.toLocaleString()}/10,000 characters
                </p>
              )}
            </div>
          </div>
        </main>
      </div>

      {/* Resume Modal */}
      {showResumeModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl w-full max-w-2xl max-h-[80vh] overflow-hidden flex flex-col">
            <div className="p-4 border-b border-stone-200 flex items-center justify-between">
              <div>
                <h2 className="font-semibold text-stone-700">Upload Resume</h2>
                <p className="text-sm text-stone-500">Paste your resume text for personalized career guidance</p>
              </div>
              <button onClick={() => setShowResumeModal(false)} className="p-2 hover:bg-stone-100 rounded-lg">
                <X className="w-5 h-5 text-stone-400" />
              </button>
            </div>
            <div className="flex-1 overflow-y-auto p-4">
              <textarea
                value={resumeText}
                onChange={(e) => setResumeText(e.target.value.slice(0, 20000))}
                placeholder="Paste your resume content here..."
                maxLength={20000}
                className="w-full h-64 px-4 py-3 border border-stone-200 rounded-lg resize-none text-sm
                           focus:outline-none focus:border-sage-400"
              />
              <div className="flex justify-between items-center mt-2">
                <p className="text-xs text-stone-400">
                  Your resume is stored locally and used only for career guidance in this session.
                </p>
                <p className={cn(
                  "text-xs",
                  resumeText.length > 18000 ? "text-amber-500" : "text-stone-400"
                )}>
                  {resumeText.length.toLocaleString()}/20,000
                </p>
              </div>
            </div>
            <div className="p-4 border-t border-stone-200 flex justify-end gap-2">
              <button
                onClick={() => {
                  setResumeText('')
                  setShowResumeModal(false)
                }}
                className="px-4 py-2 text-stone-600 hover:bg-stone-100 rounded-lg text-sm"
              >
                Clear
              </button>
              <button
                onClick={() => {
                  saveProgress(phases)
                  setShowResumeModal(false)
                }}
                className="px-4 py-2 bg-sage-400 text-white rounded-lg text-sm hover:bg-sage-500"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default function AssessPage() {
  return (
    <Suspense fallback={
      <div className="h-screen flex items-center justify-center bg-stone-50">
        <Loader2 className="w-8 h-8 animate-spin text-sage-400" />
      </div>
    }>
      <AssessmentContent />
    </Suspense>
  )
}
