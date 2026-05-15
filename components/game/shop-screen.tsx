'use client'

import { motion } from 'framer-motion'
import { useGameStore } from '@/lib/game-store'
import { UpgradeCard } from './upgrade-card'

export function ShopScreen() {
  const { upgrades, playerUpgrades, profile } = useGameStore()

  if (!profile) return null

  // Filter upgrades based on prestige level
  const availableUpgrades = upgrades.filter(
    upgrade => profile.prestige_level >= upgrade.unlock_level
  )

  const lockedUpgrades = upgrades.filter(
    upgrade => profile.prestige_level < upgrade.unlock_level
  )

  return (
    <motion.div
      className="flex flex-col gap-4 pb-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      {/* Header */}
      <div className="sticky top-0 bg-background/80 backdrop-blur-xl z-10 py-3 px-1 -mx-1">
        <h2 className="text-2xl font-bold neon-text-cyan font-[family-name:var(--font-orbitron)]">
          UPGRADE SHOP
        </h2>
        <p className="text-sm text-muted-foreground font-mono">
          Enhance your data harvesting capabilities
        </p>
      </div>

      {/* Available Upgrades */}
      <div className="flex flex-col gap-3">
        {availableUpgrades.map((upgrade, index) => (
          <motion.div
            key={upgrade.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.05 }}
          >
            <UpgradeCard 
              upgrade={upgrade} 
              owned={playerUpgrades.get(upgrade.id) || 0}
            />
          </motion.div>
        ))}
      </div>

      {/* Locked Upgrades */}
      {lockedUpgrades.length > 0 && (
        <>
          <div className="border-t border-border/50 pt-4 mt-2">
            <p className="text-sm text-muted-foreground font-mono mb-3">
              LOCKED - Requires higher prestige level
            </p>
          </div>
          <div className="flex flex-col gap-3 opacity-50">
            {lockedUpgrades.slice(0, 3).map((upgrade) => (
              <UpgradeCard 
                key={upgrade.id}
                upgrade={upgrade} 
                owned={0}
                locked
              />
            ))}
          </div>
        </>
      )}
    </motion.div>
  )
}
