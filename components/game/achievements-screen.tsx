'use client'

import { motion } from 'framer-motion'
import { 
  MousePointer, Hand, Trophy, Zap, Database, 
  Server, ShoppingCart, Package, Boxes, 
  Star, Crown, Gauge, Cpu, Check
} from 'lucide-react'
import { useGameStore } from '@/lib/game-store'
import type { Achievement } from '@/lib/types'

const iconMap: Record<string, typeof Trophy> = {
  'mouse-pointer': MousePointer,
  'mouse-pointer-click': MousePointer,
  hand: Hand,
  trophy: Trophy,
  zap: Zap,
  database: Database,
  server: Server,
  'shopping-cart': ShoppingCart,
  package: Package,
  boxes: Boxes,
  star: Star,
  crown: Crown,
  gauge: Gauge,
  cpu: Cpu,
}

function formatNumber(num: number): string {
  if (num >= 1e15) return (num / 1e15).toFixed(2) + 'Q'
  if (num >= 1e12) return (num / 1e12).toFixed(2) + 'T'
  if (num >= 1e9) return (num / 1e9).toFixed(2) + 'B'
  if (num >= 1e6) return (num / 1e6).toFixed(2) + 'M'
  if (num >= 1e3) return (num / 1e3).toFixed(2) + 'K'
  return Math.floor(num).toLocaleString()
}

function getProgress(achievement: Achievement, profile: { total_clicks: number; lifetime_bites: number; prestige_level: number; bites_per_second: number }, totalUpgrades: number): number {
  let current = 0
  switch (achievement.requirement_type) {
    case 'clicks':
      current = profile.total_clicks
      break
    case 'lifetime_bites':
      current = profile.lifetime_bites
      break
    case 'upgrades':
      current = totalUpgrades
      break
    case 'prestige':
      current = profile.prestige_level
      break
    case 'bps':
      current = profile.bites_per_second
      break
  }
  return Math.min(current / achievement.requirement_value, 1)
}

export function AchievementsScreen() {
  const { achievements, unlockedAchievements, profile, playerUpgrades } = useGameStore()

  if (!profile) return null

  const totalUpgrades = Array.from(playerUpgrades.values()).reduce((a, b) => a + b, 0)
  const unlockedCount = unlockedAchievements.size
  const totalCount = achievements.length

  return (
    <motion.div
      className="flex flex-col gap-4 pb-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      {/* Header */}
      <div className="sticky top-0 bg-background/80 backdrop-blur-xl z-10 py-3 px-1 -mx-1">
        <h2 className="text-2xl font-bold neon-text-green font-[family-name:var(--font-orbitron)]">
          ACHIEVEMENTS
        </h2>
        <div className="flex items-center justify-between mt-1">
          <p className="text-sm text-muted-foreground font-mono">
            Track your accomplishments
          </p>
          <span className="text-sm font-mono text-primary">
            {unlockedCount}/{totalCount}
          </span>
        </div>
        
        {/* Progress bar */}
        <div className="mt-3 h-2 bg-muted rounded-full overflow-hidden">
          <motion.div
            className="h-full bg-primary rounded-full"
            initial={{ width: 0 }}
            animate={{ width: `${(unlockedCount / totalCount) * 100}%` }}
            transition={{ duration: 0.5 }}
          />
        </div>
      </div>

      {/* Achievements List */}
      <div className="flex flex-col gap-3">
        {achievements.map((achievement, index) => {
          const isUnlocked = unlockedAchievements.has(achievement.id)
          const Icon = iconMap[achievement.icon] || Trophy
          const progress = isUnlocked ? 1 : getProgress(achievement, profile, totalUpgrades)

          return (
            <motion.div
              key={achievement.id}
              className={`
                p-4 rounded-xl border-2 transition-all
                ${isUnlocked 
                  ? 'bg-primary/10 border-primary/50' 
                  : 'bg-card/50 border-border/50'}
              `}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.03 }}
            >
              <div className="flex items-start gap-4">
                {/* Icon */}
                <div className={`
                  w-12 h-12 rounded-lg flex items-center justify-center
                  ${isUnlocked 
                    ? 'bg-primary/20 border border-primary/50' 
                    : 'bg-muted border border-border'}
                `}>
                  {isUnlocked ? (
                    <Check className="w-6 h-6 text-primary" />
                  ) : (
                    <Icon className="w-6 h-6 text-muted-foreground" />
                  )}
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <h3 className={`font-bold ${isUnlocked ? 'text-primary' : 'text-foreground'}`}>
                    {achievement.name}
                  </h3>
                  <p className="text-sm text-muted-foreground line-clamp-1">
                    {achievement.description}
                  </p>

                  {/* Progress bar (for unlocked) */}
                  {!isUnlocked && (
                    <div className="mt-2">
                      <div className="h-1.5 bg-muted rounded-full overflow-hidden">
                        <motion.div
                          className="h-full bg-accent rounded-full"
                          initial={{ width: 0 }}
                          animate={{ width: `${progress * 100}%` }}
                          transition={{ duration: 0.3 }}
                        />
                      </div>
                      <p className="text-xs text-muted-foreground mt-1 font-mono">
                        {Math.floor(progress * 100)}% complete
                      </p>
                    </div>
                  )}
                </div>

                {/* Reward */}
                {achievement.reward_bites > 0 && (
                  <div className="text-right">
                    <p className={`text-sm font-bold ${isUnlocked ? 'text-muted-foreground line-through' : 'text-amber-400'}`}>
                      +{formatNumber(achievement.reward_bites)}
                    </p>
                    <p className="text-xs text-muted-foreground">BITES</p>
                  </div>
                )}
              </div>
            </motion.div>
          )
        })}
      </div>
    </motion.div>
  )
}
