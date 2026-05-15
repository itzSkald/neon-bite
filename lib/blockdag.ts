import { JsonRpcProvider, formatEther } from 'ethers'

const BLOCKDAG_RPC = process.env.BLOCKDAG_RPC_ENDPOINT || 'http://rpc.bdagscan.com/'
const BLOCKDAG_CHAIN_ID = 1404

export interface BlockDAGBalance {
  balance: string // in BDAG
  balanceWei: string // in wei
  address: string
}

/**
 * Get the balance of a wallet on BlockDAG network
 */
export async function getBlockDAGBalance(address: string): Promise<BlockDAGBalance> {
  try {
    const provider = new JsonRpcProvider(BLOCKDAG_RPC, BLOCKDAG_CHAIN_ID)

    // Get balance in wei
    const balanceWei = await provider.getBalance(address)

    // Convert to BDAG
    const balance = formatEther(balanceWei)

    console.log('[v0] BlockDAG balance fetched:', {
      address,
      balance,
      balanceWei: balanceWei.toString(),
    })

    return {
      balance,
      balanceWei: balanceWei.toString(),
      address: address.toLowerCase(),
    }
  } catch (error) {
    console.error('[v0] Error fetching BlockDAG balance:', error)
    throw new Error(`Failed to fetch balance: ${error instanceof Error ? error.message : 'Unknown error'}`)
  }
}

/**
 * Verify that an address is valid on BlockDAG
 */
export async function verifyBlockDAGAddress(address: string): Promise<boolean> {
  try {
    const provider = new JsonRpcProvider(BLOCKDAG_RPC, BLOCKDAG_CHAIN_ID)

    // Try to get the code at the address (works for both EOA and contracts)
    const code = await provider.getCode(address)

    // If we can query the address, it's valid
    return true
  } catch (error) {
    console.error('[v0] Error verifying BlockDAG address:', error)
    return false
  }
}

/**
 * Get network info
 */
export async function getBlockDAGNetworkInfo() {
  try {
    const provider = new JsonRpcProvider(BLOCKDAG_RPC, BLOCKDAG_CHAIN_ID)

    const network = await provider.getNetwork()
    const blockNumber = await provider.getBlockNumber()

    return {
      chainId: network.chainId,
      name: network.name,
      blockNumber,
    }
  } catch (error) {
    console.error('[v0] Error getting BlockDAG network info:', error)
    throw new Error(`Failed to get network info: ${error instanceof Error ? error.message : 'Unknown error'}`)
  }
}
