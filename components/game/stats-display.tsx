'use client'

import { motion } from 'framer-motion'
import { useGameStore } from '@/lib/game-store'

function formatNumber(num: number): string {
  if (num >= 1e15) return (num / 1e15).toFixed(2) + 'Q'
  if (num >= 1e12) return (num / 1e12).toFixed(2) + 'T'
  if (num >= 1e9) return (num / 1e9).toFixed(2) + 'B'
  if (num >= 1e6) return (num / 1e6).toFixed(2) + 'M'
  if (num >= 1e3) return (num / 1e3).toFixed(2) + 'K'
  return Math.floor(num).toLocaleString()
}

export function StatsDisplay() {
  const { profile } = useGameStore()

  if (!profile) return null

  return (
    <div className="w-full max-w-md mx-auto">
      {/* Main Bites Counter */}
      <motion.div
        className="text-center mb-6"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <p className="text-sm font-mono text-muted-foreground uppercase tracking-wider mb-1">
          Data Harvested
        </p>
        <motion.h1 
          className="text-5xl md:text-6xl font-bold neon-text-green font-[family-name:var(--font-orbitron)]"
          key={Math.floor(profile.bites)}
          initial={{ scale: 1.05 }}
          animate={{ scale: 1 }}
          transition={{ duration: 0.1 }}
        >
          {formatNumber(profile.bites)}
        </motion.h1>
        <p className="text-lg font-mono text-primary mt-1">BITES</p>
      </motion.div>

      {/* Stats Grid */}
      <div className="grid grid-cols-3 gap-3">
        {/* BPS */}
        <motion.div
          className="bg-card/50 border border-primary/30 rounded-lg p-3 text-center backdrop-blur-sm"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <p className="text-xs font-mono text-muted-foreground uppercase">Per Second</p>
          <p className="text-lg font-bold text-cyan-400 font-[family-name:var(--font-orbitron)]">
            {formatNumber(profile.bites_per_second)}
          </p>
        </motion.div>

        {/* Total Clicks */}
        <motion.div
          className="bg-card/50 border border-accent/30 rounded-lg p-3 text-center backdrop-blur-sm"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
        >
          <p className="text-xs font-mono text-muted-foreground uppercase">Taps</p>
          <p className="text-lg font-bold text-fuchsia-400 font-[family-name:var(--font-orbitron)]">
            {formatNumber(profile.total_clicks)}
          </p>
        </motion.div>

        {/* Prestige */}
        <motion.div
          className="bg-card/50 border border-amber-500/30 rounded-lg p-3 text-center backdrop-blur-sm"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <p className="text-xs font-mono text-muted-foreground uppercase">Prestige</p>
          <p className="text-lg font-bold text-amber-400 font-[family-name:var(--font-orbitron)]">
            {profile.prestige_level}
          </p>
        </motion.div>
      </div>
    </div>
  )
}
