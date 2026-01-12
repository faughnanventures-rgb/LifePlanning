'use client'

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { 
  Target, CheckCircle, Circle, Plus, Trash2, Calendar,
  ChevronDown, ChevronUp, Loader2, Trophy, Flame, Star,
  ArrowRight, Edit2, Check, X
} from 'lucide-react'
import { cn } from '@/lib/utils'

interface Goal {
  id: string
  title: string
  pillar: string
  timeframe: '30-day' | '90-day' | '1-year'
  completed: boolean
  createdAt: string
  completedAt?: string
}

interface ActionItem {
  id: string
  title: string
  goalId?: string
  frequency: 'daily' | 'weekly' | 'once'
  completed: boolean
  streak?: number
  lastCompleted?: string
}

const GOALS_STORAGE_KEY = 'life-strategy-goals-v1'
const ACTIONS_STORAGE_KEY = 'life-strategy-actions-v1'

export default function GoalsPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  
  const [goals, setGoals] = useState<Goal[]>([])
  const [actions, setActions] = useState<ActionItem[]>([])
  const [showAddGoal, setShowAddGoal] = useState(false)
  const [showAddAction, setShowAddAction] = useState(false)
  const [newGoalTitle, setNewGoalTitle] = useState('')
  const [newGoalPillar, setNewGoalPillar] = useState('')
  const [newGoalTimeframe, setNewGoalTimeframe] = useState<Goal['timeframe']>('90-day')
  const [newActionTitle, setNewActionTitle] = useState('')
  const [newActionFrequency, setNewActionFrequency] = useState<ActionItem['frequency']>('daily')
  const [expandedTimeframe, setExpandedTimeframe] = useState<string | null>('30-day')
  const [celebration, setCelebration] = useState<string | null>(null)

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login?callbackUrl=/goals')
    }
  }, [status, router])

  useEffect(() => {
    const savedGoals = localStorage.getItem(GOALS_STORAGE_KEY)
    const savedActions = localStorage.getItem(ACTIONS_STORAGE_KEY)
    if (savedGoals) setGoals(JSON.parse(savedGoals))
    if (savedActions) setActions(JSON.parse(savedActions))
  }, [])

  useEffect(() => {
    if (goals.length > 0) {
      localStorage.setItem(GOALS_STORAGE_KEY, JSON.stringify(goals))
    }
  }, [goals])

  useEffect(() => {
    if (actions.length > 0) {
      localStorage.setItem(ACTIONS_STORAGE_KEY, JSON.stringify(actions))
    }
  }, [actions])

  const showCelebration = (message: string) => {
    setCelebration(message)
    setTimeout(() => setCelebration(null), 3000)
  }

  const addGoal = () => {
    if (!newGoalTitle.trim()) return
    const goal: Goal = {
      id: `goal_${Date.now()}`,
      title: newGoalTitle,
      pillar: newGoalPillar || 'General',
      timeframe: newGoalTimeframe,
      completed: false,
      createdAt: new Date().toISOString(),
    }
    setGoals([...goals, goal])
    setNewGoalTitle('')
    setNewGoalPillar('')
    setShowAddGoal(false)
    showCelebration('🎯 New goal added!')
  }

  const toggleGoal = (id: string) => {
    setGoals(goals.map(g => {
      if (g.id === id) {
        const completed = !g.completed
        if (completed) {
          showCelebration('🎉 Goal completed! Amazing work!')
        }
        return { ...g, completed, completedAt: completed ? new Date().toISOString() : undefined }
      }
      return g
    }))
  }

  const deleteGoal = (id: string) => {
    setGoals(goals.filter(g => g.id !== id))
  }

  const addAction = () => {
    if (!newActionTitle.trim()) return
    const action: ActionItem = {
      id: `action_${Date.now()}`,
      title: newActionTitle,
      frequency: newActionFrequency,
      completed: false,
      streak: 0,
    }
    setActions([...actions, action])
    setNewActionTitle('')
    setShowAddAction(false)
    showCelebration('✅ New action added!')
  }

  const toggleAction = (id: string) => {
    const today = new Date().toDateString()
    setActions(actions.map(a => {
      if (a.id === id) {
        const wasCompletedToday = a.lastCompleted === today
        if (wasCompletedToday) {
          return { ...a, completed: false, streak: Math.max(0, (a.streak || 0) - 1) }
        } else {
          const newStreak = (a.streak || 0) + 1
          if (newStreak > 0 && newStreak % 7 === 0) {
            showCelebration(`🔥 ${newStreak} day streak! Keep it going!`)
          } else {
            showCelebration('💪 Action completed!')
          }
          return { ...a, completed: true, streak: newStreak, lastCompleted: today }
        }
      }
      return a
    }))
  }

  const deleteAction = (id: string) => {
    setActions(actions.filter(a => a.id !== id))
  }

  const goalsByTimeframe = {
    '30-day': goals.filter(g => g.timeframe === '30-day'),
    '90-day': goals.filter(g => g.timeframe === '90-day'),
    '1-year': goals.filter(g => g.timeframe === '1-year'),
  }

  const completedGoals = goals.filter(g => g.completed).length
  const totalGoals = goals.length
  const currentStreak = Math.max(...actions.map(a => a.streak || 0), 0)

  if (status === 'loading') {
    return (
      <div className="min-h-screen bg-stone-50 flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-sage-400 animate-spin" />
      </div>
    )
  }

  if (!session) return null

  return (
    <div className="min-h-screen bg-stone-50">
      {/* Celebration Toast */}
      {celebration && (
        <div className="fixed top-4 left-1/2 -translate-x-1/2 z-50 animate-bounce">
          <div className="bg-gradient-to-r from-amber-400 to-orange-400 text-white px-6 py-3 rounded-full shadow-lg font-medium">
            {celebration}
          </div>
        </div>
      )}

      {/* Header */}
      <header className="border-b border-stone-200 bg-white sticky top-0 z-40">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-8 h-8 bg-sage-400 rounded-lg flex items-center justify-center">
              <Target className="w-4 h-4 text-white" />
            </div>
            <span className="font-semibold text-stone-700 hidden sm:inline">Life Strategy</span>
          </Link>
          <div className="flex items-center gap-2 sm:gap-4">
            <Link href="/assess" className="text-sm text-sage-600 hover:underline">
              Assessment
            </Link>
            <Link href="/report" className="text-sm text-sage-600 hover:underline">
              Report
            </Link>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 sm:px-6 py-6 sm:py-12">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-stone-800">Goals & Actions</h1>
            <p className="text-stone-500 mt-1">Track your progress and stay accountable</p>
          </div>
          
          {/* Stats */}
          <div className="flex gap-3 sm:gap-4">
            <div className="flex items-center gap-2 bg-white px-3 sm:px-4 py-2 rounded-xl border border-stone-200">
              <Trophy className="w-5 h-5 text-amber-500" />
              <div className="text-sm">
                <span className="font-bold text-stone-800">{completedGoals}</span>
                <span className="text-stone-500">/{totalGoals}</span>
              </div>
            </div>
            <div className="flex items-center gap-2 bg-white px-3 sm:px-4 py-2 rounded-xl border border-stone-200">
              <Flame className="w-5 h-5 text-orange-500" />
              <div className="text-sm">
                <span className="font-bold text-stone-800">{currentStreak}</span>
                <span className="text-stone-500 hidden sm:inline"> day streak</span>
              </div>
            </div>
          </div>
        </div>

        {/* Daily/Weekly Actions */}
        <section className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-stone-800 flex items-center gap-2">
              <Star className="w-5 h-5 text-amber-500" />
              Daily Actions
            </h2>
            <button
              onClick={() => setShowAddAction(!showAddAction)}
              className="flex items-center gap-1 text-sm text-sage-600 hover:text-sage-700"
            >
              <Plus className="w-4 h-4" />
              Add
            </button>
          </div>

          {showAddAction && (
            <div className="bg-white rounded-xl border border-stone-200 p-4 mb-4">
              <div className="flex flex-col sm:flex-row gap-3">
                <input
                  type="text"
                  value={newActionTitle}
                  onChange={(e) => setNewActionTitle(e.target.value)}
                  placeholder="e.g., 20 minute morning walk"
                  className="flex-1 px-3 py-2 border border-stone-200 rounded-lg text-sm
                             focus:outline-none focus:border-sage-400"
                />
                <select
                  value={newActionFrequency}
                  onChange={(e) => setNewActionFrequency(e.target.value as ActionItem['frequency'])}
                  className="px-3 py-2 border border-stone-200 rounded-lg text-sm
                             focus:outline-none focus:border-sage-400"
                >
                  <option value="daily">Daily</option>
                  <option value="weekly">Weekly</option>
                  <option value="once">One-time</option>
                </select>
                <button
                  onClick={addAction}
                  className="px-4 py-2 bg-sage-400 text-white rounded-lg text-sm hover:bg-sage-500"
                >
                  Add
                </button>
              </div>
            </div>
          )}

          <div className="space-y-2">
            {actions.length === 0 ? (
              <div className="bg-white rounded-xl border border-dashed border-stone-300 p-6 sm:p-8 text-center">
                <p className="text-stone-500 mb-2">No actions yet</p>
                <p className="text-sm text-stone-400">Add daily habits to build momentum</p>
              </div>
            ) : (
              actions.map(action => (
                <div
                  key={action.id}
                  className={cn(
                    "bg-white rounded-xl border p-3 sm:p-4 flex items-center gap-3 transition-all",
                    action.lastCompleted === new Date().toDateString()
                      ? "border-green-200 bg-green-50"
                      : "border-stone-200"
                  )}
                >
                  <button
                    onClick={() => toggleAction(action.id)}
                    className="flex-shrink-0"
                  >
                    {action.lastCompleted === new Date().toDateString() ? (
                      <CheckCircle className="w-6 h-6 text-green-500" />
                    ) : (
                      <Circle className="w-6 h-6 text-stone-300 hover:text-sage-400" />
                    )}
                  </button>
                  <div className="flex-1 min-w-0">
                    <p className={cn(
                      "font-medium truncate",
                      action.lastCompleted === new Date().toDateString()
                        ? "text-green-700"
                        : "text-stone-700"
                    )}>
                      {action.title}
                    </p>
                    <div className="flex items-center gap-2 text-xs text-stone-500">
                      <span className="capitalize">{action.frequency}</span>
                      {(action.streak || 0) > 0 && (
                        <span className="flex items-center gap-1 text-orange-500">
                          <Flame className="w-3 h-3" />
                          {action.streak} streak
                        </span>
                      )}
                    </div>
                  </div>
                  <button
                    onClick={() => deleteAction(action.id)}
                    className="p-1 text-stone-400 hover:text-red-500 flex-shrink-0"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))
            )}
          </div>
        </section>

        {/* Goals by Timeframe */}
        <section>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-stone-800 flex items-center gap-2">
              <Target className="w-5 h-5 text-sage-500" />
              Goals
            </h2>
            <button
              onClick={() => setShowAddGoal(!showAddGoal)}
              className="flex items-center gap-1 text-sm text-sage-600 hover:text-sage-700"
            >
              <Plus className="w-4 h-4" />
              Add Goal
            </button>
          </div>

          {showAddGoal && (
            <div className="bg-white rounded-xl border border-stone-200 p-4 mb-4">
              <div className="space-y-3">
                <input
                  type="text"
                  value={newGoalTitle}
                  onChange={(e) => setNewGoalTitle(e.target.value)}
                  placeholder="What do you want to achieve?"
                  className="w-full px-3 py-2 border border-stone-200 rounded-lg text-sm
                             focus:outline-none focus:border-sage-400"
                />
                <div className="flex flex-col sm:flex-row gap-3">
                  <input
                    type="text"
                    value={newGoalPillar}
                    onChange={(e) => setNewGoalPillar(e.target.value)}
                    placeholder="Pillar (e.g., Health, Career)"
                    className="flex-1 px-3 py-2 border border-stone-200 rounded-lg text-sm
                               focus:outline-none focus:border-sage-400"
                  />
                  <select
                    value={newGoalTimeframe}
                    onChange={(e) => setNewGoalTimeframe(e.target.value as Goal['timeframe'])}
                    className="px-3 py-2 border border-stone-200 rounded-lg text-sm
                               focus:outline-none focus:border-sage-400"
                  >
                    <option value="30-day">30-Day</option>
                    <option value="90-day">90-Day</option>
                    <option value="1-year">1-Year</option>
                  </select>
                  <button
                    onClick={addGoal}
                    className="px-4 py-2 bg-sage-400 text-white rounded-lg text-sm hover:bg-sage-500"
                  >
                    Add
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Timeframe Sections */}
          {(['30-day', '90-day', '1-year'] as const).map(timeframe => (
            <div key={timeframe} className="mb-4">
              <button
                onClick={() => setExpandedTimeframe(expandedTimeframe === timeframe ? null : timeframe)}
                className="w-full flex items-center justify-between p-3 sm:p-4 bg-white rounded-xl border border-stone-200 hover:border-stone-300"
              >
                <div className="flex items-center gap-3">
                  <Calendar className="w-5 h-5 text-stone-400" />
                  <span className="font-medium text-stone-700 capitalize">{timeframe} Goals</span>
                  <span className="text-sm text-stone-500">
                    ({goalsByTimeframe[timeframe].filter(g => g.completed).length}/{goalsByTimeframe[timeframe].length})
                  </span>
                </div>
                {expandedTimeframe === timeframe ? (
                  <ChevronUp className="w-5 h-5 text-stone-400" />
                ) : (
                  <ChevronDown className="w-5 h-5 text-stone-400" />
                )}
              </button>
              
              {expandedTimeframe === timeframe && (
                <div className="mt-2 space-y-2">
                  {goalsByTimeframe[timeframe].length === 0 ? (
                    <div className="bg-stone-50 rounded-lg p-4 text-center text-stone-500 text-sm">
                      No {timeframe} goals yet
                    </div>
                  ) : (
                    goalsByTimeframe[timeframe].map(goal => (
                      <div
                        key={goal.id}
                        className={cn(
                          "bg-white rounded-lg border p-3 sm:p-4 flex items-center gap-3",
                          goal.completed ? "border-green-200 bg-green-50" : "border-stone-200"
                        )}
                      >
                        <button onClick={() => toggleGoal(goal.id)} className="flex-shrink-0">
                          {goal.completed ? (
                            <CheckCircle className="w-6 h-6 text-green-500" />
                          ) : (
                            <Circle className="w-6 h-6 text-stone-300 hover:text-sage-400" />
                          )}
                        </button>
                        <div className="flex-1 min-w-0">
                          <p className={cn(
                            "font-medium truncate",
                            goal.completed ? "text-green-700 line-through" : "text-stone-700"
                          )}>
                            {goal.title}
                          </p>
                          <p className="text-xs text-stone-500">{goal.pillar}</p>
                        </div>
                        <button
                          onClick={() => deleteGoal(goal.id)}
                          className="p-1 text-stone-400 hover:text-red-500 flex-shrink-0"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    ))
                  )}
                </div>
              )}
            </div>
          ))}
        </section>

        {/* Empty State CTA */}
        {goals.length === 0 && actions.length === 0 && (
          <div className="mt-8 bg-gradient-to-br from-sage-50 to-teal-50 rounded-2xl p-6 sm:p-8 text-center">
            <h3 className="text-lg font-semibold text-stone-800 mb-2">
              Ready to set your goals?
            </h3>
            <p className="text-stone-600 mb-4">
              Complete your assessment first to discover your values and vision
            </p>
            <Link
              href="/assess"
              className="inline-flex items-center gap-2 px-6 py-3 bg-sage-400 text-white rounded-xl font-medium hover:bg-sage-500"
            >
              Start Assessment
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        )}
      </main>
    </div>
  )
}
