'use client'

import { motion } from 'framer-motion'
import { Home, ShoppingBag, Trophy, User, Award } from 'lucide-react'
import { useGameStore } from '@/lib/game-store'
import type { GameScreen } from '@/lib/types'

const navItems: { id: GameScreen; icon: typeof Home; label: string }[] = [
  { id: 'home', icon: Home, label: 'Core' },
  { id: 'shop', icon: ShoppingBag, label: 'Shop' },
  { id: 'leaderboard', icon: Trophy, label: 'Ranks' },
  { id: 'achievements', icon: Award, label: 'Feats' },
  { id: 'profile', icon: User, label: 'ID' },
]

export function BottomNav() {
  const { currentScreen, setScreen } = useGameStore()

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50">
      {/* Gradient fade */}
      <div className="absolute inset-0 bg-gradient-to-t from-background via-background/95 to-transparent pointer-events-none h-24 -top-8" />
      
      <div className="relative bg-card/80 border-t border-primary/30 backdrop-blur-xl">
        <div className="flex items-center justify-around px-2 py-1 max-w-lg mx-auto">
          {navItems.map((item) => {
            const isActive = currentScreen === item.id
            const Icon = item.icon

            return (
              <motion.button
                key={item.id}
                className={`relative flex flex-col items-center justify-center py-2 px-4 rounded-lg transition-colors ${
                  isActive 
                    ? 'text-primary' 
                    : 'text-muted-foreground hover:text-foreground'
                }`}
                onClick={() => setScreen(item.id)}
                whileTap={{ scale: 0.95 }}
              >
                {/* Active indicator */}
                {isActive && (
                  <motion.div
                    className="absolute inset-0 bg-primary/10 rounded-lg"
                    layoutId="activeTab"
                    transition={{ type: "spring", duration: 0.5 }}
                  />
                )}

                {/* Glow effect for active */}
                {isActive && (
                  <motion.div
                    className="absolute -top-1 left-1/2 -translate-x-1/2 w-8 h-1 bg-primary rounded-full"
                    style={{
                      boxShadow: '0 0 10px oklch(0.75 0.2 160), 0 0 20px oklch(0.75 0.2 160 / 0.5)',
                    }}
                    layoutId="activeGlow"
                    transition={{ type: "spring", duration: 0.5 }}
                  />
                )}

                <Icon 
                  className={`w-5 h-5 relative z-10 ${isActive ? 'animate-pulse-neon' : ''}`}
                />
                <span className="text-xs font-mono mt-1 relative z-10">
                  {item.label}
                </span>
              </motion.button>
            )
          })}
        </div>
      </div>
    </nav>
  )
}
