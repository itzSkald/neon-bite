'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import { Mail, CheckCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'

export default function SignUpSuccessPage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-background relative overflow-hidden">
      {/* Background effects */}
      <div className="absolute inset-0 cyber-grid opacity-20" />
      
      <motion.div
        className="w-full max-w-md z-10 text-center"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        {/* Success icon */}
        <motion.div
          className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-primary/20 border-2 border-primary mb-6"
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", duration: 0.6 }}
        >
          <CheckCircle className="w-10 h-10 text-primary" />
        </motion.div>

        <h1 className="text-3xl font-bold neon-text-green font-[family-name:var(--font-orbitron)] mb-4">
          IDENTITY CREATED
        </h1>

        <motion.div
          className="bg-card/50 border border-border/50 rounded-xl p-6 mb-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          <Mail className="w-12 h-12 text-cyan-400 mx-auto mb-4" />
          <h2 className="text-lg font-bold mb-2">Check Your Email</h2>
          <p className="text-muted-foreground font-mono text-sm">
            We&apos;ve sent a verification link to your email address. 
            Click the link to activate your cyber operator profile 
            and begin harvesting data.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
        >
          <Link href="/auth/login">
            <Button variant="outline" className="w-full">
              Return to Access Portal
            </Button>
          </Link>
        </motion.div>

        <p className="text-xs text-muted-foreground mt-6 font-mono">
          Didn&apos;t receive the email? Check your spam folder or try signing up again.
        </p>
      </motion.div>
    </div>
  )
}
