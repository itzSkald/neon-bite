'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Zap, ArrowLeft, Loader2 } from 'lucide-react'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError(null)

    const supabase = createClient()
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    if (error) {
      setError(error.message)
      setIsLoading(false)
      return
    }

    router.push('/game')
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-background relative overflow-hidden">
      {/* Background effects */}
      <div className="absolute inset-0 cyber-grid opacity-20" />
      
      <motion.div
        className="w-full max-w-md z-10"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        {/* Back button */}
        <Link href="/" className="inline-flex items-center text-muted-foreground hover:text-primary mb-8 transition-colors">
          <ArrowLeft className="w-4 h-4 mr-2" />
          <span className="font-mono text-sm">Back to landing</span>
        </Link>

        {/* Logo */}
        <div className="text-center mb-8">
          <motion.div
            className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-primary/20 border-2 border-primary mb-4"
            animate={{
              boxShadow: [
                '0 0 20px oklch(0.75 0.2 160 / 0.3)',
                '0 0 40px oklch(0.75 0.2 160 / 0.5)',
                '0 0 20px oklch(0.75 0.2 160 / 0.3)',
              ],
            }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            <Zap className="w-8 h-8 text-primary" />
          </motion.div>
          <h1 className="text-3xl font-bold neon-text-green font-[family-name:var(--font-orbitron)]">
            ACCESS PORTAL
          </h1>
          <p className="text-muted-foreground font-mono mt-2">
            Enter your credentials
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="text-sm font-mono text-muted-foreground block mb-2">
              EMAIL ADDRESS
            </label>
            <Input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="operator@neon.io"
              required
              className="bg-card border-border/50 focus:border-primary"
            />
          </div>

          <div>
            <label className="text-sm font-mono text-muted-foreground block mb-2">
              PASSWORD
            </label>
            <Input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter secure password"
              required
              className="bg-card border-border/50 focus:border-primary"
            />
          </div>

          {error && (
            <motion.p
              className="text-destructive text-sm font-mono bg-destructive/10 border border-destructive/50 rounded-lg p-3"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              {error}
            </motion.p>
          )}

          <Button
            type="submit"
            className="w-full"
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Authenticating...
              </>
            ) : (
              <>
                <Zap className="w-4 h-4 mr-2" />
                Access System
              </>
            )}
          </Button>
        </form>

        {/* Sign up link */}
        <p className="text-center text-muted-foreground font-mono text-sm mt-6">
          New operator?{' '}
          <Link href="/auth/sign-up" className="text-primary hover:underline">
            Create Identity
          </Link>
        </p>
      </motion.div>
    </div>
  )
}
