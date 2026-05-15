'use client'

import { useEffect } from 'react'
import { motion } from 'framer-motion'
import { Trophy, Medal, Award, Crown } from 'lucide-react'
import { useGameStore } from '@/lib/game-store'

function formatNumber(num: number): string {
  if (num >= 1e15) return (num / 1e15).toFixed(2) + 'Q'
  if (num >= 1e12) return (num / 1e12).toFixed(2) + 'T'
  if (num >= 1e9) return (num / 1e9).toFixed(2) + 'B'
  if (num >= 1e6) return (num / 1e6).toFixed(2) + 'M'
  if (num >= 1e3) return (num / 1e3).toFixed(2) + 'K'
  return Math.floor(num).toLocaleString()
}

const positionIcons = [Crown, Medal, Award]
const positionColors = ['text-amber-400', 'text-slate-300', 'text-amber-600']

export function LeaderboardScreen() {
  const { leaderboard, fetchLeaderboard, profile } = useGameStore()

  useEffect(() => {
    fetchLeaderboard()
    const interval = setInterval(fetchLeaderboard, 30000) // Refresh every 30s
    return () => clearInterval(interval)
  }, [fetchLeaderboard])

  return (
    <motion.div
      className="flex flex-col gap-4 pb-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      {/* Header */}
      <div className="sticky top-0 bg-background/80 backdrop-blur-xl z-10 py-3 px-1 -mx-1">
        <h2 className="text-2xl font-bold neon-text-pink font-[family-name:var(--font-orbitron)]">
          GLOBAL RANKINGS
        </h2>
        <p className="text-sm text-muted-foreground font-mono">
          Top data harvesters worldwide
        </p>
      </div>

      {/* Top 3 Podium */}
      <div className="flex items-end justify-center gap-4 py-6">
        {[1, 0, 2].map((index) => {
          const entry = leaderboard[index]
          if (!entry) return null
          
          const Icon = positionIcons[index] || Trophy
          const heightClass = index === 0 ? 'h-32' : index === 1 ? 'h-24' : 'h-20'
          const isCurrentUser = entry.id === profile?.id

          return (
            <motion.div
              key={entry.id}
              className={`flex flex-col items-center ${index === 0 ? 'order-2' : index === 1 ? 'order-1' : 'order-3'}`}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              {/* Avatar/Icon */}
              <div className={`
                w-14 h-14 rounded-full flex items-center justify-center mb-2
                ${index === 0 ? 'bg-amber-500/20 border-2 border-amber-400' : 
                  index === 1 ? 'bg-slate-400/20 border-2 border-slate-300' : 
                  'bg-amber-700/20 border-2 border-amber-600'}
                ${isCurrentUser ? 'ring-2 ring-primary ring-offset-2 ring-offset-background' : ''}
              `}>
                <Icon className={`w-7 h-7 ${positionColors[index]}`} />
              </div>

              {/* Name */}
              <p className={`text-sm font-bold truncate max-w-20 ${isCurrentUser ? 'text-primary' : ''}`}>
                {entry.username}
              </p>

              {/* Bites */}
              <p className="text-xs text-muted-foreground font-mono">
                {formatNumber(entry.lifetime_bites)}
              </p>

              {/* Podium */}
              <div className={`
                ${heightClass} w-16 mt-3 rounded-t-lg flex items-start justify-center pt-3
                ${index === 0 ? 'bg-amber-500/30 border-t-2 border-x-2 border-amber-400' : 
                  index === 1 ? 'bg-slate-400/30 border-t-2 border-x-2 border-slate-300' : 
                  'bg-amber-700/30 border-t-2 border-x-2 border-amber-600'}
              `}>
                <span className={`text-2xl font-bold ${positionColors[index]} font-[family-name:var(--font-orbitron)]`}>
                  {index + 1}
                </span>
              </div>
            </motion.div>
          )
        })}
      </div>

      {/* Rest of Leaderboard */}
      <div className="flex flex-col gap-2">
        {leaderboard.slice(3, 50).map((entry, index) => {
          const isCurrentUser = entry.id === profile?.id

          return (
            <motion.div
              key={entry.id}
              className={`
                flex items-center gap-3 p-3 rounded-lg border
                ${isCurrentUser 
                  ? 'bg-primary/10 border-primary/50' 
                  : 'bg-card/50 border-border/50'}
              `}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 + index * 0.02 }}
            >
              {/* Position */}
              <div className="w-8 text-center">
                <span className="text-lg font-bold text-muted-foreground font-mono">
                  {index + 4}
                </span>
              </div>

              {/* Avatar placeholder */}
              <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center">
                <span className="text-sm font-bold text-muted-foreground">
                  {entry.username.charAt(0).toUpperCase()}
                </span>
              </div>

              {/* Info */}
              <div className="flex-1 min-w-0">
                <p className={`font-bold truncate ${isCurrentUser ? 'text-primary' : ''}`}>
                  {entry.username}
                </p>
                <p className="text-xs text-muted-foreground font-mono">
                  Prestige {entry.prestige_level}
                </p>
              </div>

              {/* Lifetime Bites */}
              <div className="text-right">
                <p className="font-bold text-primary font-[family-name:var(--font-orbitron)]">
                  {formatNumber(entry.lifetime_bites)}
                </p>
                <p className="text-xs text-muted-foreground">lifetime</p>
              </div>
            </motion.div>
          )
        })}
      </div>

      {leaderboard.length === 0 && (
        <div className="text-center py-12 text-muted-foreground">
          <Trophy className="w-12 h-12 mx-auto mb-4 opacity-50" />
          <p>Loading leaderboard...</p>
        </div>
      )}
    </motion.div>
  )
}
