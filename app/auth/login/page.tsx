'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { useWallet } from '@/lib/wallet-context'
import { Button } from '@/components/ui/button'
import { Zap, ArrowLeft, Loader2, Wallet } from 'lucide-react'

export default function LoginPage() {
  const router = useRouter()
  const { address, isConnected, isConnecting, error, balance, connectWallet, signMessage, setBalance } = useWallet()
  const [isAuthenticating, setIsAuthenticating] = useState(false)
  const [authError, setAuthError] = useState<string | null>(null)

  // Auto-authenticate when wallet is connected
  useEffect(() => {
    const authenticate = async () => {
      if (isConnected && address && !isAuthenticating) {
        await handleWalletAuth()
      }
    }
    authenticate()
  }, [isConnected, address])

  const handleWalletConnect = async () => {
    setAuthError(null)
    await connectWallet()
  }

  const handleWalletAuth = async () => {
    if (!address) return

    setIsAuthenticating(true)
    setAuthError(null)

    try {
      // Create a challenge message
      const message = `Sign this message to authenticate to NEON BITE\n\nWallet: ${address}\nTimestamp: ${new Date().toISOString()}`

      // Get user to sign the message
      const signature = await signMessage(message)

      // Send signature to backend for verification
      const response = await fetch('/api/auth/wallet', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          address,
          message,
          signature,
        }),
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error || 'Authentication failed')
      }

      const data = await response.json()

      // Store token in localStorage
      localStorage.setItem('wallet_token', data.token)
      localStorage.setItem('wallet_address', data.address)

      // Set balance if available
      if (data.blockdagBalance) {
        setBalance(data.blockdagBalance)
        localStorage.setItem('blockdag_balance', data.blockdagBalance)
      }

      // Redirect to game
      router.push('/game')
    } catch (err: any) {
      setAuthError(err.message || 'Authentication failed')
      setIsAuthenticating(false)
    }
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
            Connect your BlockDAG wallet to play
          </p>
        </div>

        {/* Wallet Connection */}
        <div className="space-y-4">
          {/* Error Messages */}
          {(error || authError) && (
            <motion.p
              className="text-destructive text-sm font-mono bg-destructive/10 border border-destructive/50 rounded-lg p-3"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              {error || authError}
            </motion.p>
          )}

          {/* Connected Status */}
          {isConnected && (
            <motion.div
              className="space-y-2"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              <div className="p-3 bg-primary/10 border border-primary/50 rounded-lg text-primary text-sm font-mono">
                <div className="flex items-center gap-2">
                  <Wallet className="w-4 h-4" />
                  <span>Connected: {address?.slice(0, 6)}...{address?.slice(-4)}</span>
                </div>
              </div>
              {balance && (
                <div className="p-3 bg-green-900/20 border border-green-500/50 rounded-lg text-green-200 text-sm font-mono">
                  <div className="flex items-center justify-between">
                    <span>BDAG Balance:</span>
                    <span className="font-bold">{balance} BDAG</span>
                  </div>
                </div>
              )}
            </motion.div>
          )}

          {/* Connect Button */}
          <Button
            onClick={handleWalletConnect}
            disabled={isConnecting || isAuthenticating || isConnected}
            className="w-full"
            size="lg"
          >
            {isConnecting || isAuthenticating ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                {isConnecting ? 'Connecting...' : 'Authenticating...'}
              </>
            ) : isConnected ? (
              <>
                <Zap className="w-4 h-4 mr-2" />
                Wallet Connected
              </>
            ) : (
              <>
                <Wallet className="w-4 h-4 mr-2" />
                Connect Wallet
              </>
            )}
          </Button>

          {/* Info Box */}
          <div className="bg-card/50 border border-border/50 rounded-lg p-4 text-sm text-muted-foreground font-mono space-y-2">
            <p className="flex items-start gap-2">
              <span className="text-primary">01.</span>
              Click &quot;Connect Wallet&quot; to link your wallet
            </p>
            <p className="flex items-start gap-2">
              <span className="text-primary">02.</span>
              Sign the message to verify ownership
            </p>
            <p className="flex items-start gap-2">
              <span className="text-primary">03.</span>
              Start playing and earn on BlockDAG
            </p>
          </div>
        </div>

        {/* MetaMask link */}
        <p className="text-center text-muted-foreground font-mono text-sm mt-6">
          Don&apos;t have a wallet?{' '}
          <a 
            href="https://metamask.io" 
            target="_blank" 
            rel="noopener noreferrer"
            className="text-primary hover:underline"
          >
            Install MetaMask
          </a>
        </p>
      </motion.div>
    </div>
  )
}
