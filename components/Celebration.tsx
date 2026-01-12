'use client'

import { useState, useEffect } from 'react'
import { Trophy, Star, Sparkles, Flame, Heart, Rocket } from 'lucide-react'
import { cn } from '@/lib/utils'

interface CelebrationProps {
  type: 'phase-complete' | 'milestone' | 'streak' | 'report-ready' | 'goal-complete'
  message?: string
  onClose?: () => void
}

const CELEBRATION_CONFIG = {
  'phase-complete': {
    icon: Star,
    title: 'Phase Complete!',
    color: 'from-amber-400 to-orange-400',
    emoji: '⭐',
  },
  'milestone': {
    icon: Trophy,
    title: 'Milestone Reached!',
    color: 'from-yellow-400 to-amber-400',
    emoji: '🏆',
  },
  'streak': {
    icon: Flame,
    title: 'Streak!',
    color: 'from-orange-400 to-red-400',
    emoji: '🔥',
  },
  'report-ready': {
    icon: Sparkles,
    title: 'Report Ready!',
    color: 'from-purple-400 to-pink-400',
    emoji: '✨',
  },
  'goal-complete': {
    icon: Rocket,
    title: 'Goal Achieved!',
    color: 'from-green-400 to-emerald-400',
    emoji: '🎯',
  },
}

export function Celebration({ type, message, onClose }: CelebrationProps) {
  const [isVisible, setIsVisible] = useState(true)
  const config = CELEBRATION_CONFIG[type]
  const Icon = config.icon

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(false)
      onClose?.()
    }, 4000)

    return () => clearTimeout(timer)
  }, [onClose])

  if (!isVisible) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center pointer-events-none">
      {/* Confetti effect */}
      <div className="absolute inset-0 overflow-hidden">
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className="absolute animate-confetti"
            style={{
              left: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 0.5}s`,
              animationDuration: `${2 + Math.random()}s`,
            }}
          >
            <span className="text-2xl">{['🎉', '⭐', '✨', '🎊', '💫'][Math.floor(Math.random() * 5)]}</span>
          </div>
        ))}
      </div>

      {/* Main celebration card */}
      <div 
        className={cn(
          'bg-gradient-to-br text-white rounded-3xl p-8 shadow-2xl animate-celebration-pop pointer-events-auto',
          config.color
        )}
      >
        <div className="text-center">
          <div className="text-6xl mb-4 animate-bounce">{config.emoji}</div>
          <h2 className="text-2xl font-bold mb-2">{config.title}</h2>
          {message && <p className="text-white/90">{message}</p>}
        </div>
      </div>
    </div>
  )
}

// Hook for managing celebrations
export function useCelebration() {
  const [celebration, setCelebration] = useState<{
    type: CelebrationProps['type']
    message?: string
  } | null>(null)

  const celebrate = (type: CelebrationProps['type'], message?: string) => {
    setCelebration({ type, message })
  }

  const clearCelebration = () => {
    setCelebration(null)
  }

  return {
    celebration,
    celebrate,
    clearCelebration,
    CelebrationComponent: celebration ? (
      <Celebration
        type={celebration.type}
        message={celebration.message}
        onClose={clearCelebration}
      />
    ) : null,
  }
}

// Milestone messages
export const MILESTONE_MESSAGES = {
  firstPhase: "You've completed your first conversation!",
  halfwayQuick: "Halfway there! You're doing great.",
  halfwayFull: "Halfway through! Keep going.",
  almostDone: "One more phase to go!",
  assessmentComplete: "You've completed your assessment!",
  reportGenerated: "Your strategic plan is ready!",
  firstGoal: "Your first goal is set!",
  weekStreak: "7 days in a row! Amazing consistency.",
  monthStreak: "30 day streak! You're unstoppable.",
}
