export interface SpiralIDConfig {
  apiUrl?: string
  chainId?: number
  contractAddress?: string
}

export interface Spiral {
  id: string
  owner: string
  createdAt: Date
  metadata?: Record<string, any>
}

export interface AuthPayload {
  address: string
  signature: string
  message: string
  nonce: string
}

export interface ZKAuthPayload {
  address: string
  zkProof: string
  nonce: string
}

export interface AuthResponse {
  token: string
  expiresAt: Date
  user: {
    address: string
    spirals: Spiral[]
  }
}

export interface ZKAuthResponse extends AuthResponse {
  zkVerified: boolean
}

export interface BurnSpiralOptions {
  spiralId: string
  amount: string
}

export interface CreateSpiralOptions {
  metadata?: Record<string, any>
}

export interface PremiumSpiralFeatures {
  bio?: string
  avatar?: string
  socialLinks?: string[]
  traits?: string[]
  isVerified?: boolean
  premiumBadge?: boolean
}

export interface SpiralTrait {
  id: string
  name: string
  description: string
  rarity: 'common' | 'rare' | 'epic' | 'legendary'
  metadata?: Record<string, any>
}

export interface Achievement {
  id: string
  name: string
  description: string
  points: number
  unlockedAt?: Date
}

export interface ApiError {
  message: string
  code: string
  details?: Record<string, any>
}

declare global {
  interface Window {
    ethereum?: any
  }
}