'use client'

import { motion } from 'framer-motion'
import { 
  Zap, Cpu, Database, Code, Atom, 
  Sparkles, Brain, Router, Anchor, Sun, Lock
} from 'lucide-react'
import { useGameStore } from '@/lib/game-store'
import type { Upgrade } from '@/lib/types'
import { RARITY_COLORS } from '@/lib/types'

const iconMap: Record<string, typeof Zap> = {
  zap: Zap,
  cpu: Cpu,
  database: Database,
  code: Code,
  atom: Atom,
  sparkles: Sparkles,
  brain: Brain,
  router: Router,
  anchor: Anchor,
  sun: Sun,
}

function formatNumber(num: number): string {
  if (num >= 1e15) return (num / 1e15).toFixed(2) + 'Q'
  if (num >= 1e12) return (num / 1e12).toFixed(2) + 'T'
  if (num >= 1e9) return (num / 1e9).toFixed(2) + 'B'
  if (num >= 1e6) return (num / 1e6).toFixed(2) + 'M'
  if (num >= 1e3) return (num / 1e3).toFixed(2) + 'K'
  return Math.floor(num).toLocaleString()
}

interface UpgradeCardProps {
  upgrade: Upgrade
  owned: number
  locked?: boolean
}

export function UpgradeCard({ upgrade, owned, locked }: UpgradeCardProps) {
  const { profile, purchaseUpgrade, calculateUpgradeCost } = useGameStore()
  const Icon = iconMap[upgrade.icon] || Zap
  const rarity = RARITY_COLORS[upgrade.rarity]
  
  const cost = calculateUpgradeCost(upgrade, owned)
  const canAfford = profile && profile.bites >= cost && !locked

  const handlePurchase = async () => {
    if (canAfford) {
      await purchaseUpgrade(upgrade.id)
    }
  }

  return (
    <motion.button
      className={`
        w-full p-4 rounded-xl border-2 text-left transition-all
        ${rarity.bg} ${rarity.border}
        ${canAfford ? 'cursor-pointer hover:scale-[1.02]' : 'cursor-not-allowed opacity-60'}
        ${canAfford ? `shadow-lg ${rarity.glow}` : ''}
      `}
      onClick={handlePurchase}
      whileTap={canAfford ? { scale: 0.98 } : {}}
      disabled={!canAfford}
    >
      <div className="flex items-start gap-4">
        {/* Icon */}
        <div 
          className={`
            w-12 h-12 rounded-lg flex items-center justify-center
            ${rarity.bg} border ${rarity.border}
          `}
          style={{
            boxShadow: locked ? 'none' : `0 0 15px ${upgrade.glow_color}40`,
          }}
        >
          {locked ? (
            <Lock className="w-6 h-6 text-muted-foreground" />
          ) : (
            <Icon 
              className={`w-6 h-6 ${rarity.text}`}
              style={{ filter: `drop-shadow(0 0 5px ${upgrade.glow_color})` }}
            />
          )}
        </div>

        {/* Info */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <h3 className={`font-bold ${rarity.text} font-[family-name:var(--font-orbitron)]`}>
              {upgrade.name}
            </h3>
            <span className={`text-xs px-2 py-0.5 rounded-full ${rarity.bg} ${rarity.border} ${rarity.text} uppercase font-mono`}>
              {upgrade.rarity}
            </span>
          </div>
          <p className="text-sm text-muted-foreground line-clamp-1">
            {upgrade.description}
          </p>
          <div className="flex items-center justify-between mt-2">
            <span className="text-sm font-mono text-cyan-400">
              +{formatNumber(upgrade.production)} BPS
            </span>
            {!locked && (
              <span className="text-sm font-mono text-muted-foreground">
                Owned: {owned}
              </span>
            )}
            {locked && (
              <span className="text-sm font-mono text-amber-400">
                Prestige {upgrade.unlock_level} required
              </span>
            )}
          </div>
        </div>

        {/* Cost */}
        {!locked && (
          <div className="text-right">
            <p className={`text-lg font-bold font-[family-name:var(--font-orbitron)] ${canAfford ? 'text-primary' : 'text-destructive'}`}>
              {formatNumber(cost)}
            </p>
            <p className="text-xs text-muted-foreground font-mono">BITES</p>
          </div>
        )}
      </div>
    </motion.button>
  )
}
