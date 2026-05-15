'use client'

import { useEffect, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { useGameStore } from '@/lib/game-store'
import { createClient } from '@/lib/supabase/client'
import { BottomNav } from './bottom-nav'
import { HomeScreen } from './home-screen'
import { ShopScreen } from './shop-screen'
import { LeaderboardScreen } from './leaderboard-screen'
import { AchievementsScreen } from './achievements-screen'
import { ProfileScreen } from './profile-screen'
import { Loader2 } from 'lucide-react'

interface GameLayoutProps {
  userId: string
}

export function GameLayout({ userId }: GameLayoutProps) {
  const { currentScreen, initializeGame, isLoading } = useGameStore()
  const [isInitialized, setIsInitialized] = useState(false)

  useEffect(() => {
    const init = async () => {
      await initializeGame(userId)
      setIsInitialized(true)
    }
    init()
  }, [userId, initializeGame])

  // Handle page visibility for idle earnings
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        // Could calculate offline earnings here
      }
    }

    document.addEventListener('visibilitychange', handleVisibilityChange)
    return () => document.removeEventListener('visibilitychange', handleVisibilityChange)
  }, [])

  // Subscribe to auth changes
  useEffect(() => {
    const supabase = createClient()
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event) => {
      if (event === 'SIGNED_OUT') {
        window.location.href = '/'
      }
    })

    return () => subscription.unsubscribe()
  }, [])

  if (isLoading || !isInitialized) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <motion.div
          className="flex flex-col items-center gap-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          <Loader2 className="w-12 h-12 text-primary animate-spin" />
          <p className="text-muted-foreground font-mono">Initializing neural link...</p>
        </motion.div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Main content area */}
      <main className="pb-24 px-4 pt-4 max-w-lg mx-auto">
        <AnimatePresence mode="wait">
          {currentScreen === 'home' && <HomeScreen key="home" />}
          {currentScreen === 'shop' && <ShopScreen key="shop" />}
          {currentScreen === 'leaderboard' && <LeaderboardScreen key="leaderboard" />}
          {currentScreen === 'achievements' && <AchievementsScreen key="achievements" />}
          {currentScreen === 'profile' && <ProfileScreen key="profile" />}
        </AnimatePresence>
      </main>

      {/* Bottom navigation */}
      <BottomNav />
    </div>
  )
}
