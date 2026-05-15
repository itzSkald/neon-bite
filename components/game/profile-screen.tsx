'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { LogOut, Star, Zap, Clock, RefreshCw, AlertTriangle } from 'lucide-react'
import { useGameStore } from '@/lib/game-store'
import { Button } from '@/components/ui/button'

function formatNumber(num: number): string {
  if (num >= 1e15) return (num / 1e15).toFixed(2) + 'Q'
  if (num >= 1e12) return (num / 1e12).toFixed(2) + 'T'
  if (num >= 1e9) return (num / 1e9).toFixed(2) + 'B'
  if (num >= 1e6) return (num / 1e6).toFixed(2) + 'M'
  if (num >= 1e3) return (num / 1e3).toFixed(2) + 'K'
  return Math.floor(num).toLocaleString()
}

function formatDate(dateString: string): string {
  const date = new Date(dateString)
  return date.toLocaleDateString('en-US', { 
    year: 'numeric', 
    month: 'short', 
    day: 'numeric' 
  })
}

export function ProfileScreen() {
  const { profile, prestige, signOut, unlockedAchievements, playerUpgrades } = useGameStore()
  const [showPrestigeConfirm, setShowPrestigeConfirm] = useState(false)
  const [isSigningOut, setIsSigningOut] = useState(false)

  if (!profile) return null

  const totalUpgrades = Array.from(playerUpgrades.values()).reduce((a, b) => a + b, 0)
  const canPrestige = profile.lifetime_bites >= 1000000
  const prestigeBonus = ((profile.prestige_level + 1) * 10)

  const handlePrestige = async () => {
    await prestige()
    setShowPrestigeConfirm(false)
  }

  const handleSignOut = async () => {
    setIsSigningOut(true)
    await signOut()
    window.location.href = '/'
  }

  return (
    <motion.div
      className="flex flex-col gap-6 pb-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      {/* Header */}
      <div className="sticky top-0 bg-background/80 backdrop-blur-xl z-10 py-3 px-1 -mx-1">
        <h2 className="text-2xl font-bold text-foreground font-[family-name:var(--font-orbitron)]">
          CYBER ID
        </h2>
        <p className="text-sm text-muted-foreground font-mono">
          Your digital identity
        </p>
      </div>

      {/* Profile Card */}
      <motion.div
        className="p-6 rounded-2xl border-2 border-primary/30 bg-card/50 backdrop-blur-sm"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        {/* Avatar & Name */}
        <div className="flex items-center gap-4 mb-6">
          <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-primary/30 to-accent/30 border-2 border-primary/50 flex items-center justify-center">
            <span className="text-3xl font-bold text-primary font-[family-name:var(--font-orbitron)]">
              {profile.username.charAt(0).toUpperCase()}
            </span>
          </div>
          <div>
            <h3 className="text-2xl font-bold neon-text-green font-[family-name:var(--font-orbitron)]">
              {profile.username}
            </h3>
            <p className="text-sm text-muted-foreground font-mono flex items-center gap-1">
              <Clock className="w-3 h-3" />
              Joined {formatDate(profile.created_at)}
            </p>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 gap-3">
          <div className="bg-background/50 rounded-lg p-3 border border-border/50">
            <p className="text-xs text-muted-foreground font-mono uppercase">Lifetime Bites</p>
            <p className="text-xl font-bold text-primary font-[family-name:var(--font-orbitron)]">
              {formatNumber(profile.lifetime_bites)}
            </p>
          </div>
          <div className="bg-background/50 rounded-lg p-3 border border-border/50">
            <p className="text-xs text-muted-foreground font-mono uppercase">Total Taps</p>
            <p className="text-xl font-bold text-fuchsia-400 font-[family-name:var(--font-orbitron)]">
              {formatNumber(profile.total_clicks)}
            </p>
          </div>
          <div className="bg-background/50 rounded-lg p-3 border border-border/50">
            <p className="text-xs text-muted-foreground font-mono uppercase">Achievements</p>
            <p className="text-xl font-bold text-amber-400 font-[family-name:var(--font-orbitron)]">
              {unlockedAchievements.size}
            </p>
          </div>
          <div className="bg-background/50 rounded-lg p-3 border border-border/50">
            <p className="text-xs text-muted-foreground font-mono uppercase">Upgrades Owned</p>
            <p className="text-xl font-bold text-cyan-400 font-[family-name:var(--font-orbitron)]">
              {totalUpgrades}
            </p>
          </div>
        </div>
      </motion.div>

      {/* Prestige Section */}
      <motion.div
        className="p-6 rounded-2xl border-2 border-amber-500/30 bg-amber-950/20 backdrop-blur-sm"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <div className="flex items-center gap-3 mb-4">
          <div className="w-12 h-12 rounded-lg bg-amber-500/20 border border-amber-500/50 flex items-center justify-center">
            <Star className="w-6 h-6 text-amber-400" />
          </div>
          <div>
            <h3 className="font-bold text-amber-400 font-[family-name:var(--font-orbitron)]">
              PRESTIGE SYSTEM
            </h3>
            <p className="text-sm text-muted-foreground">
              Current Level: <span className="text-amber-400 font-bold">{profile.prestige_level}</span>
            </p>
          </div>
        </div>

        <p className="text-sm text-muted-foreground mb-4">
          Prestige resets your bites, BPS, and upgrades, but grants a permanent 
          <span className="text-amber-400 font-bold"> +{prestigeBonus}% </span> 
          tap multiplier.
        </p>

        <div className="flex items-center justify-between mb-4 p-3 bg-background/30 rounded-lg">
          <span className="text-sm font-mono text-muted-foreground">Requirement</span>
          <span className={`font-bold ${canPrestige ? 'text-primary' : 'text-destructive'}`}>
            {formatNumber(profile.lifetime_bites)} / 1M
          </span>
        </div>

        <Button
          className="w-full"
          variant={canPrestige ? "default" : "secondary"}
          disabled={!canPrestige}
          onClick={() => setShowPrestigeConfirm(true)}
        >
          <RefreshCw className="w-4 h-4 mr-2" />
          {canPrestige ? 'Prestige Now' : 'Not Enough Bites'}
        </Button>
      </motion.div>

      {/* Sign Out */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <Button
          variant="outline"
          className="w-full border-destructive/50 text-destructive hover:bg-destructive/10"
          onClick={handleSignOut}
          disabled={isSigningOut}
        >
          <LogOut className="w-4 h-4 mr-2" />
          {isSigningOut ? 'Signing Out...' : 'Sign Out'}
        </Button>
      </motion.div>

      {/* Prestige Confirmation Modal */}
      <AnimatePresence>
        {showPrestigeConfirm && (
          <motion.div
            className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setShowPrestigeConfirm(false)}
          >
            <motion.div
              className="bg-card border-2 border-amber-500/50 rounded-2xl p-6 max-w-sm w-full"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center gap-3 mb-4">
                <AlertTriangle className="w-8 h-8 text-amber-400" />
                <h3 className="text-xl font-bold text-amber-400 font-[family-name:var(--font-orbitron)]">
                  CONFIRM PRESTIGE
                </h3>
              </div>
              <p className="text-muted-foreground mb-6">
                This will reset your current bites, BPS, and all upgrades. 
                You will gain Prestige Level {profile.prestige_level + 1} 
                and a permanent +{prestigeBonus}% tap bonus.
              </p>
              <div className="flex gap-3">
                <Button
                  variant="outline"
                  className="flex-1"
                  onClick={() => setShowPrestigeConfirm(false)}
                >
                  Cancel
                </Button>
                <Button
                  className="flex-1 bg-amber-500 hover:bg-amber-600 text-black"
                  onClick={handlePrestige}
                >
                  <Zap className="w-4 h-4 mr-2" />
                  Prestige
                </Button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}
