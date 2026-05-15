'use client'

import { motion } from 'framer-motion'
import { NeonCore } from './neon-core'
import { StatsDisplay } from './stats-display'
import { ParticleBackground } from './particle-background'

export function HomeScreen() {
  return (
    <motion.div
      className="flex flex-col items-center justify-center min-h-[calc(100vh-180px)] relative"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      {/* Background particles */}
      <ParticleBackground />
      
      {/* Stats at top */}
      <div className="w-full mb-8">
        <StatsDisplay />
      </div>

      {/* Central Neon Core */}
      <div className="flex-1 flex items-center justify-center">
        <NeonCore />
      </div>
    </motion.div>
  )
}
