'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { 
  Target, ArrowLeft, CheckCircle, Circle, Plus, Trash2,
  ChevronDown, ChevronRight, Sparkles, Trophy, Clock, Edit2, Save, X
} from 'lucide-react'
import { cn } from '@/lib/utils'

interface Goal {
  id: string
  title: string
  description?: string
  timeline?: string
  completed: boolean
  completedAt?: string
  createdAt: string
  notes?: string
}

interface GoalsData {
  goals: Goal[]
  lastUpdated: string
}

const GOALS_STORAGE_KEY = 'life-strategy-goals'

function generateId(): string {
  return Date.now().toString(36) + Math.random().toString(36).substr(2)
}

function extractGoalsFromReport(reportMarkdown: string): Goal[] {
  const goals: Goal[] = []
  const numberedGoalRegex = /^\d+\.\s+\*\*(.+?)\*\*\s*[—-]\s*(.+?)\s*[—-]\s*\*(.+?)\*/gm
  let match
  
  while ((match = numberedGoalRegex.exec(reportMarkdown)) !== null) {
    goals.push({
      id: generateId(),
      title: match[1].trim(),
      description: match[2].trim(),
      timeline: match[3].trim(),
      completed: false,
      createdAt: new Date().toISOString()
    })
  }
  
  if (goals.length === 0) {
    const bulletGoalRegex = /^[-•]\s+\*\*(.+?)\*\*:?\s*(.*)$/gm
    while ((match = bulletGoalRegex.exec(reportMarkdown)) !== null) {
      goals.push({
        id: generateId(),
        title: match[1].trim(),
        description: match[2].trim() || undefined,
        completed: false,
        createdAt: new Date().toISOString()
      })
    }
  }
  
  return goals
}

function GoalItem({ 
  goal, 
  onToggle, 
  onDelete,
  onUpdate 
}: { 
  goal: Goal
  onToggle: () => void
  onDelete: () => void
  onUpdate: (updates: Partial<Goal>) => void
}) {
  const [isExpanded, setIsExpanded] = useState(false)
  const [isEditingNotes, setIsEditingNotes] = useState(false)
  const [notes, setNotes] = useState(goal.notes || '')

  const saveNotes = () => {
    onUpdate({ notes })
    setIsEditingNotes(false)
  }

  return (
    <div className={cn(
      "bg-white rounded-xl border transition-all",
      goal.completed 
        ? "border-sage-200 bg-sage-50/50" 
        : "border-stone-200 hover:border-sage-300"
    )}>
      <div className="p-4">
        <div className="flex items-start gap-3">
          <button
            onClick={onToggle}
            className={cn(
              "flex-shrink-0 mt-0.5 transition-colors",
              goal.completed ? "text-sage-500" : "text-stone-300 hover:text-sage-400"
            )}
          >
            {goal.completed ? (
              <CheckCircle className="w-6 h-6" />
            ) : (
              <Circle className="w-6 h-6" />
            )}
          </button>
          
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-2">
              <h3 className={cn(
                "font-medium",
                goal.completed ? "text-stone-400 line-through" : "text-stone-700"
              )}>
                {goal.title}
              </h3>
              
              <button
                onClick={() => setIsExpanded(!isExpanded)}
                className="text-stone-400 hover:text-stone-600 p-1"
              >
                {isExpanded ? (
                  <ChevronDown className="w-4 h-4" />
                ) : (
                  <ChevronRight className="w-4 h-4" />
                )}
              </button>
            </div>
            
            <div className="flex flex-wrap items-center gap-2 mt-1">
              {goal.timeline && (
                <span className={cn(
                  "inline-flex items-center gap-1 text-xs px-2 py-0.5 rounded-full",
                  goal.completed 
                    ? "bg-sage-100 text-sage-600" 
                    : "bg-amber-100 text-amber-700"
                )}>
                  <Clock className="w-3 h-3" />
                  {goal.timeline}
                </span>
              )}
              {goal.completedAt && (
                <span className="text-xs text-sage-600">
                  Completed {new Date(goal.completedAt).toLocaleDateString()}
                </span>
              )}
            </div>
            
            {goal.description && (
              <p className={cn(
                "text-sm mt-2",
                goal.completed ? "text-stone-400" : "text-stone-500"
              )}>
                {goal.description}
              </p>
            )}
          </div>
        </div>
        
        {isExpanded && (
          <div className="mt-4 pt-4 border-t border-stone-100 ml-9">
            <div className="mb-3">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-medium text-stone-500 uppercase tracking-wide">
                  Notes & Progress
                </span>
                {!isEditingNotes && (
                  <button
                    onClick={() => setIsEditingNotes(true)}
                    className="text-xs text-sage-600 hover:text-sage-700 flex items-center gap-1"
                  >
                    <Edit2 className="w-3 h-3" />
                    Edit
                  </button>
                )}
              </div>
              
              {isEditingNotes ? (
                <div className="space-y-2">
                  <textarea
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder="Add notes about your progress..."
                    className="w-full px-3 py-2 text-sm border border-stone-200 rounded-lg
                               focus:outline-none focus:border-sage-400 resize-none"
                    rows={3}
                  />
                  <div className="flex gap-2">
                    <button
                      onClick={saveNotes}
                      className="flex items-center gap-1 px-3 py-1.5 text-xs bg-sage-400 text-white 
                                 rounded-lg hover:bg-sage-500"
                    >
                      <Save className="w-3 h-3" />
                      Save
                    </button>
                    <button
                      onClick={() => {
                        setNotes(goal.notes || '')
                        setIsEditingNotes(false)
                      }}
                      className="flex items-center gap-1 px-3 py-1.5 text-xs text-stone-600 
                                 hover:bg-stone-100 rounded-lg"
                    >
                      <X className="w-3 h-3" />
                      Cancel
                    </button>
                  </div>
                </div>
              ) : (
                <p className="text-sm text-stone-500 italic">
                  {goal.notes || 'No notes yet. Click edit to add progress updates.'}
                </p>
              )}
            </div>
            
            <button
              onClick={onDelete}
              className="flex items-center gap-1 text-xs text-red-500 hover:text-red-600"
            >
              <Trash2 className="w-3 h-3" />
              Remove goal
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

function AddGoalForm({ onAdd }: { onAdd: (goal: Omit<Goal, 'id' | 'completed' | 'createdAt'>) => void }) {
  const [isOpen, setIsOpen] = useState(false)
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [timeline, setTimeline] = useState('')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!title.trim()) return
    
    onAdd({
      title: title.trim(),
      description: description.trim() || undefined,
      timeline: timeline.trim() || undefined
    })
    
    setTitle('')
    setDescription('')
    setTimeline('')
    setIsOpen(false)
  }

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="w-full p-4 border-2 border-dashed border-stone-200 rounded-xl
                   text-stone-400 hover:text-sage-500 hover:border-sage-300
                   flex items-center justify-center gap-2 transition-colors"
      >
        <Plus className="w-5 h-5" />
        Add a goal
      </button>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="bg-white rounded-xl border border-sage-200 p-4">
      <h3 className="font-medium text-stone-700 mb-3">Add New Goal</h3>
      
      <div className="space-y-3">
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Goal title *"
          className="w-full px-3 py-2 border border-stone-200 rounded-lg
                     focus:outline-none focus:border-sage-400"
          autoFocus
        />
        
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Description (optional)"
          className="w-full px-3 py-2 border border-stone-200 rounded-lg
                     focus:outline-none focus:border-sage-400 resize-none"
          rows={2}
        />
        
        <input
          type="text"
          value={timeline}
          onChange={(e) => setTimeline(e.target.value)}
          placeholder="Timeline (e.g., Q1, March, End of year)"
          className="w-full px-3 py-2 border border-stone-200 rounded-lg
                     focus:outline-none focus:border-sage-400"
        />
      </div>
      
      <div className="flex gap-2 mt-4">
        <button
          type="submit"
          disabled={!title.trim()}
          className="px-4 py-2 bg-sage-400 text-white rounded-lg hover:bg-sage-500
                     disabled:bg-stone-300 disabled:cursor-not-allowed"
        >
          Add Goal
        </button>
        <button
          type="button"
          onClick={() => setIsOpen(false)}
          className="px-4 py-2 text-stone-600 hover:bg-stone-100 rounded-lg"
        >
          Cancel
        </button>
      </div>
    </form>
  )
}

export default function GoalsPage() {
  const [goals, setGoals] = useState<Goal[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [hasReport, setHasReport] = useState(false)
  const [showImportPrompt, setShowImportPrompt] = useState(false)

  useEffect(() => {
    try {
      const savedGoals = localStorage.getItem(GOALS_STORAGE_KEY)
      if (savedGoals) {
        const data: GoalsData = JSON.parse(savedGoals)
        setGoals(data.goals)
      }
      
      const savedReport = localStorage.getItem('life-strategy-report')
      if (savedReport) {
        setHasReport(true)
        if (!savedGoals) {
          setShowImportPrompt(true)
        }
      }
    } catch (err) {
      console.error('Failed to load goals:', err)
    } finally {
      setIsLoading(false)
    }
  }, [])

  const saveGoals = (newGoals: Goal[]) => {
    setGoals(newGoals)
    localStorage.setItem(GOALS_STORAGE_KEY, JSON.stringify({
      goals: newGoals,
      lastUpdated: new Date().toISOString()
    }))
  }

  const importFromReport = () => {
    try {
      const savedReport = localStorage.getItem('life-strategy-report')
      if (!savedReport) return
      
      const reportData = JSON.parse(savedReport)
      const extractedGoals = extractGoalsFromReport(reportData.markdown || '')
      
      if (extractedGoals.length > 0) {
        saveGoals([...goals, ...extractedGoals])
      }
      
      setShowImportPrompt(false)
    } catch (err) {
      console.error('Failed to import goals:', err)
    }
  }

  const toggleGoal = (id: string) => {
    const newGoals = goals.map(goal => {
      if (goal.id === id) {
        return {
          ...goal,
          completed: !goal.completed,
          completedAt: !goal.completed ? new Date().toISOString() : undefined
        }
      }
      return goal
    })
    saveGoals(newGoals)
  }

  const deleteGoal = (id: string) => {
    saveGoals(goals.filter(g => g.id !== id))
  }

  const updateGoal = (id: string, updates: Partial<Goal>) => {
    const newGoals = goals.map(goal => {
      if (goal.id === id) {
        return { ...goal, ...updates }
      }
      return goal
    })
    saveGoals(newGoals)
  }

  const addGoal = (goalData: Omit<Goal, 'id' | 'completed' | 'createdAt'>) => {
    const newGoal: Goal = {
      ...goalData,
      id: generateId(),
      completed: false,
      createdAt: new Date().toISOString()
    }
    saveGoals([...goals, newGoal])
  }

  const completedCount = goals.filter(g => g.completed).length
  const totalCount = goals.length
  const progressPercent = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0

  const activeGoals = goals.filter(g => !g.completed)
  const completedGoals = goals.filter(g => g.completed)

  if (isLoading) {
    return (
      <div className="min-h-screen bg-stone-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-sage-400" />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-stone-50">
      <header className="border-b border-stone-200 bg-white">
        <div className="max-w-3xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-8 h-8 bg-sage-400 rounded-lg flex items-center justify-center">
              <Target className="w-5 h-5 text-white" />
            </div>
            <span className="font-semibold text-stone-700">Life Strategy</span>
            <span className="px-1.5 py-0.5 bg-amber-100 text-amber-700 text-[10px] font-medium rounded">
              BETA
            </span>
          </Link>
          <Link
            href="/report"
            className="flex items-center gap-1 text-sm text-stone-500 hover:text-stone-700"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Report
          </Link>
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-6 py-8">
        <div className="mb-8">
          <div className="flex items-center justify-between mb-2">
            <h1 className="text-2xl font-bold text-stone-700">Goal Tracker</h1>
            {totalCount > 0 && (
              <div className="flex items-center gap-2">
                <Trophy className={cn(
                  "w-5 h-5",
                  progressPercent === 100 ? "text-amber-500" : "text-stone-300"
                )} />
                <span className="text-lg font-semibold text-stone-700">
                  {completedCount}/{totalCount}
                </span>
              </div>
            )}
          </div>
          
          {totalCount > 0 && (
            <div className="space-y-2">
              <div className="h-2 bg-stone-200 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-sage-400 transition-all duration-500"
                  style={{ width: `${progressPercent}%` }}
                />
              </div>
              <p className="text-sm text-stone-500">
                {progressPercent === 100 
                  ? '🎉 All goals completed! Amazing work!'
                  : `${progressPercent}% complete — keep going!`
                }
              </p>
            </div>
          )}
        </div>

        {showImportPrompt && (
          <div className="mb-6 p-4 bg-sage-50 border border-sage-200 rounded-xl">
            <div className="flex items-start gap-3">
              <Sparkles className="w-5 h-5 text-sage-500 flex-shrink-0 mt-0.5" />
              <div className="flex-1">
                <h3 className="font-medium text-stone-700 mb-1">
                  Import goals from your report?
                </h3>
                <p className="text-sm text-stone-500 mb-3">
                  We can extract goals from your strategic plan to help you track progress.
                </p>
                <div className="flex gap-2">
                  <button
                    onClick={importFromReport}
                    className="px-4 py-2 text-sm bg-sage-400 text-white rounded-lg hover:bg-sage-500"
                  >
                    Import Goals
                  </button>
                  <button
                    onClick={() => setShowImportPrompt(false)}
                    className="px-4 py-2 text-sm text-stone-600 hover:bg-stone-100 rounded-lg"
                  >
                    Skip
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {goals.length === 0 && !showImportPrompt && (
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-stone-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Target className="w-8 h-8 text-stone-400" />
            </div>
            <h2 className="text-lg font-medium text-stone-700 mb-2">No goals yet</h2>
            <p className="text-stone-500 mb-6 max-w-md mx-auto">
              {hasReport 
                ? 'Import goals from your strategic plan or add them manually below.'
                : 'Complete your assessment and generate a report, then come back to track your goals.'}
            </p>
            {hasReport && (
              <button
                onClick={importFromReport}
                className="inline-flex items-center gap-2 px-4 py-2 bg-sage-400 text-white 
                           rounded-lg hover:bg-sage-500 mb-4"
              >
                <Sparkles className="w-4 h-4" />
                Import from Report
              </button>
            )}
          </div>
        )}

        {activeGoals.length > 0 && (
          <div className="mb-8">
            <h2 className="text-sm font-medium text-stone-500 uppercase tracking-wide mb-3">
              Active Goals ({activeGoals.length})
            </h2>
            <div className="space-y-3">
              {activeGoals.map(goal => (
                <GoalItem
                  key={goal.id}
                  goal={goal}
                  onToggle={() => toggleGoal(goal.id)}
                  onDelete={() => deleteGoal(goal.id)}
                  onUpdate={(updates) => updateGoal(goal.id, updates)}
                />
              ))}
            </div>
          </div>
        )}

        <div className="mb-8">
          <AddGoalForm onAdd={addGoal} />
        </div>

        {completedGoals.length > 0 && (
          <div>
            <h2 className="text-sm font-medium text-stone-500 uppercase tracking-wide mb-3">
              Completed ({completedGoals.length})
            </h2>
            <div className="space-y-3">
              {completedGoals.map(goal => (
                <GoalItem
                  key={goal.id}
                  goal={goal}
                  onToggle={() => toggleGoal(goal.id)}
                  onDelete={() => deleteGoal(goal.id)}
                  onUpdate={(updates) => updateGoal(goal.id, updates)}
                />
              ))}
            </div>
          </div>
        )}

        <div className="mt-12 pt-8 border-t border-stone-200">
          <div className="flex flex-wrap gap-4 text-sm">
            <Link href="/report" className="text-sage-600 hover:text-sage-700">
              ← View Report
            </Link>
            <Link href="/assess" className="text-sage-600 hover:text-sage-700">
              Continue Assessment
            </Link>
          </div>
        </div>
      </main>

      <footer className="py-6 px-6 border-t border-stone-200 bg-stone-100">
        <div className="max-w-3xl mx-auto text-center text-sm text-stone-500">
          © {new Date().getFullYear()} Life Strategy Planner. All rights reserved.
        </div>
      </footer>
    </div>
  )
}
