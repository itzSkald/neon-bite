'use client'

import { createContext, useContext, useState, useCallback, ReactNode, useEffect } from 'react'
import { BrowserProvider } from 'ethers'

interface WalletContextType {
  address: string | null
  isConnected: boolean
  isConnecting: boolean
  error: string | null
  connectWallet: () => Promise<void>
  disconnectWallet: () => void
  signMessage: (message: string) => Promise<string>
}

const WalletContext = createContext<WalletContextType | undefined>(undefined)

export function WalletProvider({ children }: { children: ReactNode }) {
  const [address, setAddress] = useState<string | null>(null)
  const [isConnected, setIsConnected] = useState(false)
  const [isConnecting, setIsConnecting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Check if wallet is already connected on mount
  useEffect(() => {
    const checkConnection = async () => {
      if (typeof window !== 'undefined' && window.ethereum) {
        try {
          const accounts = await window.ethereum.request({
            method: 'eth_accounts',
          })
          if (accounts && accounts.length > 0) {
            setAddress(accounts[0])
            setIsConnected(true)
          }
        } catch (err) {
          console.log('[v0] No existing wallet connection')
        }
      }
    }
    checkConnection()
  }, [])

  const connectWallet = useCallback(async () => {
    if (!window.ethereum) {
      setError('MetaMask or compatible wallet not found. Please install MetaMask.')
      return
    }

    setIsConnecting(true)
    setError(null)

    try {
      const accounts = await window.ethereum.request({
        method: 'eth_requestAccounts',
      })

      if (accounts && accounts.length > 0) {
        setAddress(accounts[0])
        setIsConnected(true)
      }
    } catch (err: any) {
      if (err.code === 4001) {
        setError('Wallet connection was rejected')
      } else {
        setError(err.message || 'Failed to connect wallet')
      }
      setIsConnected(false)
    } finally {
      setIsConnecting(false)
    }
  }, [])

  const disconnectWallet = useCallback(() => {
    setAddress(null)
    setIsConnected(false)
    setError(null)
  }, [])

  const signMessage = useCallback(async (message: string): Promise<string> => {
    if (!address || !window.ethereum) {
      throw new Error('Wallet not connected')
    }

    try {
      const provider = new BrowserProvider(window.ethereum)
      const signer = await provider.getSigner()
      const signature = await signer.signMessage(message)
      return signature
    } catch (err: any) {
      throw new Error(err.message || 'Failed to sign message')
    }
  }, [address])

  return (
    <WalletContext.Provider
      value={{
        address,
        isConnected,
        isConnecting,
        error,
        connectWallet,
        disconnectWallet,
        signMessage,
      }}
    >
      {children}
    </WalletContext.Provider>
  )
}

export function useWallet() {
  const context = useContext(WalletContext)
  if (context === undefined) {
    throw new Error('useWallet must be used within WalletProvider')
  }
  return context
}

// Extend window type for ethereum
declare global {
  interface Window {
    ethereum?: any
  }
}
