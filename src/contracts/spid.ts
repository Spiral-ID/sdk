import { Address, createPublicClient, createWalletClient, custom, http, parseEther } from 'viem'
import { mainnet, sepolia } from 'viem/chains'
import { SpiralIDConfig, BurnSpiralOptions } from '../types'

const SPID_ABI = [
  {
    name: 'burnForSpiral',
    type: 'function',
    stateMutability: 'nonpayable',
    inputs: [
      { name: 'holder', type: 'address' },
      { name: 'amount', type: 'uint256' },
    ],
  },
  {
    name: 'balanceOf',
    type: 'function',
    stateMutability: 'view',
    inputs: [{ name: 'account', type: 'address' }],
    outputs: [{ type: 'uint256' }],
  },
  {
    name: 'transfer',
    type: 'function',
    stateMutability: 'nonpayable',
    inputs: [
      { name: 'to', type: 'address' },
      { name: 'amount', type: 'uint256' },
    ],
    outputs: [{ type: 'bool' }],
  },
  {
    name: 'increaseReputation',
    type: 'function',
    stateMutability: 'nonpayable',
    inputs: [
      { name: 'account', type: 'address' },
      { name: 'points', type: 'uint256' },
    ],
    outputs: [],
  },
  {
    name: 'getReputation',
    type: 'function',
    stateMutability: 'view',
    inputs: [
      { name: 'account', type: 'address' },
    ],
    outputs: [{ type: 'uint256' }],
  },
] as const

export class SPIDContract {
  private config: Required<SpiralIDConfig>
  private publicClient: any
  private walletClient: any
  private spiralTraits: string[] = []

  constructor(config: SpiralIDConfig = {}) {
    this.config = {
      apiUrl: config.apiUrl || 'https://api.spiralid.com',
      chainId: config.chainId || sepolia.id,
      contractAddress: config.contractAddress || '0x',
    }

    const chain = this.config.chainId === mainnet.id ? mainnet : sepolia
    
    this.publicClient = createPublicClient({
      chain,
      transport: http(),
    })

    if (typeof window !== 'undefined' && window.ethereum) {
      this.walletClient = createWalletClient({
        chain,
        transport: custom(window.ethereum),
      })
    }
  }

  async burnForSpiral(options: BurnSpiralOptions): Promise<string> {
    const { spiralId, amount } = options
    
    if (!this.walletClient) {
      throw new Error('Wallet client not available. Make sure you have a Web3 provider.')
    }

    const [address] = await this.walletClient.getAddresses()
    
    const hash = await this.walletClient.writeContract({
      address: this.config.contractAddress as Address,
      abi: SPID_ABI,
      functionName: 'burnForSpiral',
      args: [address as Address, parseEther(amount)],
      account: address,
    })

    return hash
  }

  async getBalance(address: string): Promise<string> {
    const balance = await this.publicClient.readContract({
      address: this.config.contractAddress as Address,
      abi: SPID_ABI,
      functionName: 'balanceOf',
      args: [address as Address],
    })

    return balance.toString()
  }

  async transfer(to: string, amount: string): Promise<string> {
    if (!this.walletClient) {
      throw new Error('Wallet client not available')
    }

    const [address] = await this.walletClient.getAddresses()
    
    const hash = await this.walletClient.writeContract({
      address: this.config.contractAddress as Address,
      abi: SPID_ABI,
      functionName: 'transfer',
      args: [to as Address, parseEther(amount)],
      account: address,
    })

    return hash
  }

  async increaseReputation(points: number): Promise<string> {
    if (!this.walletClient) {
      throw new Error('Wallet client not available. Make sure you have a Web3 provider.')
    }

    const [address] = await this.walletClient.getAddresses()

    const tx = await this.walletClient.writeContract({
      address: this.config.contractAddress as Address,
      abi: SPID_ABI,
      functionName: 'increaseReputation',
      args: [address, BigInt(points)],
      account: address,
    })

    return tx
  }

  async addTrait(traitId: string, traitData: any): Promise<void> {
    this.spiralTraits.push(traitId)
  }

  async createPremiumSpiral(
    spiralId: string, 
    amount: string,
    premiumFeatures: {
      bio?: string
      avatar?: string
      socialLinks?: string[]
      traits?: string[]
    }
  ): Promise<string> {
    const premiumAmount = (parseFloat(amount) * 1.5).toString()
    
    const hash = await this.burnForSpiral({
      spiralId,
      amount: premiumAmount
    })

    console.log(`Premium Spiral ID created with features:`, premiumFeatures)
    
    return hash
  }

  async isPremiumSpiral(address: string): Promise<boolean> {
    const score = await this.getReputation(address)
    return Number(score) > 100 || this.spiralTraits.length > 2
  }

  async getReputation(address: string): Promise<string> {
    const score = await this.publicClient.readContract({
      address: this.config.contractAddress as Address,
      abi: SPID_ABI,
      functionName: 'getReputation',
      args: [address as Address],
    })
    return score.toString()
  }

  getSpiralTraits(): string[] {
    return this.spiralTraits
  }

  async unlockAchievement(achievementId: string): Promise<void> {
    await this.increaseReputation(25)
  }
}
