'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import { AlertTriangle } from 'lucide-react'
import { Button } from '@/components/ui/button'

export default function AuthErrorPage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-background relative overflow-hidden">
      {/* Background effects */}
      <div className="absolute inset-0 cyber-grid opacity-20" />
      
      <motion.div
        className="w-full max-w-md z-10 text-center"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        {/* Error icon */}
        <motion.div
          className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-destructive/20 border-2 border-destructive mb-6"
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", duration: 0.6 }}
        >
          <AlertTriangle className="w-10 h-10 text-destructive" />
        </motion.div>

        <h1 className="text-3xl font-bold text-destructive font-[family-name:var(--font-orbitron)] mb-4">
          SYSTEM ERROR
        </h1>

        <p className="text-muted-foreground font-mono mb-6">
          Authentication failed. The verification link may have expired 
          or there was an error processing your request.
        </p>

        <div className="flex flex-col gap-3">
          <Link href="/auth/login">
            <Button className="w-full">
              Try Logging In
            </Button>
          </Link>
          <Link href="/auth/sign-up">
            <Button variant="outline" className="w-full">
              Create New Identity
            </Button>
          </Link>
        </div>
      </motion.div>
    </div>
  )
}
