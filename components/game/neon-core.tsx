'use client'

import { useState, useCallback, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useGameStore } from '@/lib/game-store'

interface FloatingNumber {
  id: number
  x: number
  y: number
  value: number
}

export function NeonCore() {
  const { tap, profile } = useGameStore()
  const [floatingNumbers, setFloatingNumbers] = useState<FloatingNumber[]>([])
  const [isPressed, setIsPressed] = useState(false)
  const coreRef = useRef<HTMLDivElement>(null)
  const idRef = useRef(0)

  const handleTap = useCallback((e: React.MouseEvent | React.TouchEvent) => {
    tap()
    
    // Get tap position relative to the core
    const rect = coreRef.current?.getBoundingClientRect()
    if (!rect) return

    let clientX: number, clientY: number
    if ('touches' in e) {
      clientX = e.touches[0].clientX
      clientY = e.touches[0].clientY
    } else {
      clientX = e.clientX
      clientY = e.clientY
    }

    const x = clientX - rect.left
    const y = clientY - rect.top

    // Calculate tap value
    const prestigeMultiplier = profile ? 1 + (profile.prestige_level * 0.1) : 1
    const tapValue = Math.ceil(1 * prestigeMultiplier)

    // Add floating number
    const newNumber: FloatingNumber = {
      id: idRef.current++,
      x: x + (Math.random() - 0.5) * 40,
      y: y,
      value: tapValue,
    }

    setFloatingNumbers(prev => [...prev, newNumber])

    // Remove after animation
    setTimeout(() => {
      setFloatingNumbers(prev => prev.filter(n => n.id !== newNumber.id))
    }, 1000)
  }, [tap, profile])

  return (
    <div className="relative flex items-center justify-center" ref={coreRef}>
      {/* Outer glow rings */}
      <motion.div
        className="absolute w-72 h-72 rounded-full border-2 border-primary/20"
        animate={{
          scale: [1, 1.1, 1],
          opacity: [0.3, 0.5, 0.3],
        }}
        transition={{
          duration: 3,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />
      <motion.div
        className="absolute w-64 h-64 rounded-full border border-primary/30"
        animate={{
          scale: [1.1, 1, 1.1],
          opacity: [0.4, 0.6, 0.4],
        }}
        transition={{
          duration: 2.5,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />
      
      {/* Main Core Button */}
      <motion.button
        className="relative w-48 h-48 rounded-full bg-gradient-to-br from-card via-background to-card border-4 border-primary overflow-hidden cursor-pointer select-none touch-manipulation"
        style={{
          boxShadow: `
            0 0 30px oklch(0.75 0.2 160 / 0.5),
            0 0 60px oklch(0.75 0.2 160 / 0.3),
            inset 0 0 30px oklch(0.75 0.2 160 / 0.2)
          `,
        }}
        whileTap={{ scale: 0.95 }}
        onMouseDown={() => setIsPressed(true)}
        onMouseUp={() => setIsPressed(false)}
        onMouseLeave={() => setIsPressed(false)}
        onTouchStart={() => setIsPressed(true)}
        onTouchEnd={() => setIsPressed(false)}
        onClick={handleTap}
        onTouchEnd={(e) => {
          setIsPressed(false)
          handleTap(e)
        }}
      >
        {/* Inner glow effect */}
        <motion.div
          className="absolute inset-0 rounded-full bg-gradient-to-br from-primary/30 via-transparent to-primary/10"
          animate={{
            opacity: isPressed ? 1 : 0.5,
          }}
          transition={{ duration: 0.1 }}
        />
        
        {/* Core symbol */}
        <div className="absolute inset-0 flex items-center justify-center">
          <motion.div
            className="relative"
            animate={{
              rotate: 360,
            }}
            transition={{
              duration: 20,
              repeat: Infinity,
              ease: "linear",
            }}
          >
            {/* Hexagon pattern */}
            <svg width="100" height="100" viewBox="0 0 100 100" className="text-primary">
              <polygon 
                points="50,5 90,27.5 90,72.5 50,95 10,72.5 10,27.5" 
                fill="none" 
                stroke="currentColor" 
                strokeWidth="2"
                className="animate-pulse-neon"
              />
              <polygon 
                points="50,20 75,35 75,65 50,80 25,65 25,35" 
                fill="none" 
                stroke="currentColor" 
                strokeWidth="1.5"
                opacity="0.6"
              />
              <circle cx="50" cy="50" r="15" fill="currentColor" opacity="0.3" />
              <circle cx="50" cy="50" r="8" fill="currentColor" className="animate-pulse" />
            </svg>
          </motion.div>
        </div>

        {/* Press effect overlay */}
        <AnimatePresence>
          {isPressed && (
            <motion.div
              className="absolute inset-0 rounded-full bg-primary/30"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.1 }}
            />
          )}
        </AnimatePresence>
      </motion.button>

      {/* Floating numbers */}
      <AnimatePresence>
        {floatingNumbers.map((num) => (
          <motion.div
            key={num.id}
            className="absolute pointer-events-none font-bold text-2xl neon-text-green"
            style={{
              left: num.x,
              top: num.y,
            }}
            initial={{ opacity: 1, y: 0, scale: 1 }}
            animate={{ opacity: 0, y: -80, scale: 1.3 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            +{num.value}
          </motion.div>
        ))}
      </AnimatePresence>

      {/* Tap instruction */}
      <motion.p
        className="absolute -bottom-10 text-sm text-muted-foreground font-mono"
        animate={{
          opacity: [0.5, 1, 0.5],
        }}
        transition={{
          duration: 2,
          repeat: Infinity,
        }}
      >
        TAP TO HARVEST
      </motion.p>
    </div>
  )
}
