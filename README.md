# @spiral-id/sdk

Official SDK for Spiral ID - Global Web3 identity platform with social features and reputation system.

## Installation

```bash
npm install @spiral-id/sdk
# or
yarn add @spiral-id/sdk
# or
pnpm add @spiral-id/sdk
```

## Quick Start

### 1. Authentication

```typescript
import { SpiralSDK } from '@spiral-id/sdk'

const sdk = new SpiralSDK({
  apiUrl: 'https://api.spiralid.dev',
  chainId: 11155111, // Sepolia
  contractAddress: '0xYourContractAddress',
})

// Authenticate user
async function login() {
  try {
    const authResponse = await sdk.auth.web3.authenticate()
    console.log('Auth token:', authResponse.token)
    
    // Set auth token for API calls
    sdk.setAuthToken(authResponse.token)
    
    return authResponse
  } catch (error) {
    console.error('Authentication failed:', error)
  }
}
```

### 2. Interact with SPID Token Contract

```typescript
// Get token balance
async function getBalance(address: string) {
  const balance = await sdk.contracts.spid.getBalance(address)
  console.log('Balance:', balance)
  return balance
}

// Burn SPID to create Spiral ID
async function createSpiral(spiralId: string, amount: string) {
  const txHash = await sdk.contracts.spid.burnForSpiral({
    spiralId,
    amount
  })
  console.log('Transaction hash:', txHash)
  return txHash
}

// 🚀 EXCLUSIVE FEATURES (Competitive Differentiation)

// Create Premium Spiral ID with exclusive features
async function createPremiumSpiral() {
  const txHash = await sdk.contracts.spid.createPremiumSpiral(
    'my-premium-id',
    '100', // Amount to burn
    {
      bio: 'Web3 enthusiast and builder',
      avatar: 'https://example.com/avatar.png',
      socialLinks: ['twitter.com/user', 'github.com/user'],
      traits: ['verified', 'early-adopter']
    }
  )
  console.log('Premium Spiral created:', txHash)
}

// Increase reputation through activities
async function earnReputation() {
  await sdk.contracts.spid.increaseReputation(50)
  const score = await sdk.contracts.spid.getReputation('0xYourAddress')
  console.log('Reputation score:', score)
}

// Add unique traits to your Spiral ID
async function addUniqueTrait() {
  await sdk.contracts.spid.addTrait('gold-member', {
    benefits: ['exclusive-access', 'priority-support']
  })
  const traits = sdk.contracts.spid.getSpiralTraits()
  console.log('Current traits:', traits)
}

// Unlock achievements
async function unlockAchievements() {
  await sdk.contracts.spid.unlockAchievement('first-transaction')
  await sdk.contracts.spid.unlockAchievement('community-contributor')
}

// Check if Spiral ID is premium
function checkPremiumStatus() {
  const isPremium = sdk.contracts.spid.isPremiumSpiral()
  console.log('Is premium:', isPremium)
  return isPremium
}
```

## 🚀 Global-First Features (Our Competitive Edge)

### Premium Spiral IDs
- **Global premium identities** with exclusive features
- **Custom bios, avatars, and social links**
- **Verified status and premium badges** recognized worldwide

### Global Reputation System
- **Universal reputation points** across all platforms
- **Reputation-based access** to premium features
- **Cross-platform reputation portability**

### NFT Traits & Achievements
- **Collectible traits** as verifiable NFTs
- **Global achievement system** with milestones
- **Rarity system** (Common, Rare, Epic, Legendary) for collectors

### Worldwide Social Features
- **Global social graph** connecting Spiral IDs worldwide
- **International community governance** for premium holders
- **Cross-cultural verification** and endorsements

## Why Choose Spiral ID Over Competitors?

| Feature | Spiral ID | ENS | Worldcoin | Others |
|---------|-----------|-----|-----------|---------|
| **Social Identity** | ✅ | ❌ | ❌ | ❌ |
| **Reputation System** | ✅ | ❌ | ❌ | Limited |
| **Premium Features** | ✅ | ❌ | ❌ | ❌ |
| **NFT Traits** | ✅ | ❌ | ❌ | ❌ |
| **Achievements** | ✅ | ❌ | ❌ | ❌ |
| **Multi-chain** | ✅ | ❌ | ✅ | Limited |
| **Global Community** | ✅ | ❌ | ✅ | Limited |

### 3. API Operations

```typescript
// Get user's spirals
async function getSpirals() {
  const spirals = await sdk.api.getSpirals()
  console.log('Spirals:', spirals)
  return spirals
}

// Create new spiral
async function createSpiral() {
  const spiral = await sdk.api.createSpiral({
    metadata: {
      name: 'My Spiral',
      description: 'My first spiral',
    }
  })
  console.log('Created spiral:', spiral)
  return spiral
}
```

## API Reference

### SpiralSDK

Main SDK class that provides access to all modules.

```typescript
const sdk = new SpiralSDK(config?: SpiralIDConfig)
```

**Config Options:**
- `apiUrl`: string - API base URL (default: 'https://api.spiralid.com')
- `chainId`: number - Chain ID (default: 11155111 for Sepolia)
- `contractAddress`: string - SPID contract address

### Authentication

```typescript
// Connect wallet
const address = await sdk.auth.web3.connectWallet()

// Sign message
const signature = await sdk.auth.web3.signMessage('Hello World')

// Full authentication flow
const authData = await sdk.auth.web3.authenticate()
```

### Contracts

```typescript
// Get token balance
const balance = await sdk.contracts.spid.getBalance(address)

// Burn tokens for spiral creation
const txHash = await sdk.contracts.spid.burnForSpiral({
  spiralId: 'spiral-123',
  amount: '100',
})

// Transfer tokens
const transferHash = await sdk.contracts.spid.transfer(toAddress, amount)
```

### API

```typescript
// Spirals management
const spirals = await sdk.api.getSpirals()
const spiral = await sdk.api.getSpiral('spiral-123')
const newSpiral = await sdk.api.createSpiral({ metadata: { ... } })
await sdk.api.updateSpiral('spiral-123', { metadata: { ... } })
await sdk.api.deleteSpiral('spiral-123')

// User profile
const profile = await sdk.api.getUserProfile(address)
```

## Error Handling

All SDK methods throw errors that can be caught with try/catch:

```typescript
try {
  await sdk.auth.web3.authenticate()
} catch (error) {
  console.error('Authentication error:', error.message)
  // Handle specific error types
}
```

## Requirements

- Node.js 18+
- Web3 wallet (MetaMask, WalletConnect, etc.)
- Modern browser with ES2020 support

## Development

```bash
# Install dependencies
npm install

# Build SDK
npm run build

# Development watch mode
npm run dev
```

## License

MIT
