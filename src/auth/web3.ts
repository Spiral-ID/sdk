import { createWalletClient, custom, getAddress } from 'viem'
import { mainnet, sepolia } from 'viem/chains'
import { AuthPayload, AuthResponse, SpiralIDConfig } from '../types'
import { ZKProofService } from '../zk/proofService'
import { SignatureUtils } from '../zk/signatureUtils'

export class Web3Auth {
  private config: Required<SpiralIDConfig>
  private walletClient: any
  private zkProofService: ZKProofService

  constructor(config: SpiralIDConfig = {}) {
    this.config = {
      apiUrl: config.apiUrl || 'https://api.spiralid.com',
      chainId: config.chainId || sepolia.id,
      contractAddress: config.contractAddress || '0x',
    }

    // Initialize ZK proof service
    this.zkProofService = new ZKProofService()

    if (typeof window !== 'undefined' && window.ethereum) {
      const chain = this.config.chainId === mainnet.id ? mainnet : sepolia
      this.walletClient = createWalletClient({
        chain,
        transport: custom(window.ethereum),
      })
    }
  }

  async connectWallet(): Promise<string> {
    if (!this.walletClient) {
      throw new Error('Web3 provider not available. Please install MetaMask or another wallet.')
    }

    try {
      const [address] = await this.walletClient.requestAddresses()
      return getAddress(address)
    } catch (error) {
      throw new Error('Failed to connect wallet: ' + (error as Error).message)
    }
  }

  async signMessage(message: string): Promise<string> {
    if (!this.walletClient) {
      throw new Error('Wallet client not available')
    }

    const [address] = await this.walletClient.getAddresses()
    
    try {
      const signature = await this.walletClient.signMessage({
        account: address,
        message,
      })
      
      return signature
    } catch (error) {
      throw new Error('Failed to sign message: ' + (error as Error).message)
    }
  }

  async generateNonce(address: string): Promise<string> {
    const response = await fetch(`${this.config.apiUrl}/api/auth/nonce`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ address }),
    })

    if (!response.ok) {
      throw new Error('Failed to generate nonce')
    }

    const { nonce } = await response.json()
    return nonce
  }

  async authenticate(): Promise<AuthResponse> {
    const address = await this.connectWallet()
    const nonce = await this.generateNonce(address)
    
    const message = `Welcome to Spiral ID!\n\nSign this message to authenticate.\nNonce: ${nonce}`
    const signature = await this.signMessage(message)

    const response = await fetch(`${this.config.apiUrl}/api/auth/verify`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        address,
        signature,
        message,
        nonce,
      }),
    })

    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.message || 'Authentication failed')
    }

    return response.json()
  }

  // ZK-based authentication methods
  async authenticateWithZKProof(): Promise<AuthResponse> {
    const address = await this.connectWallet()
    const nonce = await this.generateNonce(address)
    
    const message = `Welcome to Spiral ID!\n\nSign this message to generate ZK proof.\nNonce: ${nonce}`
    const signature = await this.signMessage(message)

    // Generate ZK proof instead of sending raw signature
    const zkProof = await this.generateZKProof(message, signature, address)

    const response = await fetch(`${this.config.apiUrl}/api/auth/verify-zk`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        address,
        zkProof: JSON.stringify(zkProof),
        nonce,
      }),
    })

    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.message || 'ZK authentication failed')
    }

    return response.json()
  }

  async generateZKProof(message: string, signature: string, publicKey: string): Promise<any> {
    const keyPair = SignatureUtils.deriveEdDSAKeyPairFromEthereumSignature(signature)
    const edDSASignature = SignatureUtils.signMessage(message, keyPair.privateKey)
    const inputs = SignatureUtils.prepareZKInputs(message, edDSASignature, keyPair.publicKey)
    
    // Generate the ZK proof
    return await this.zkProofService.generateProof(inputs)
  }

  async verifyZKProof(proof: any): Promise<boolean> {
    return await this.zkProofService.verifyProof(proof)
  }

  // Method to get ZK proof service for advanced usage
  getZKProofService(): ZKProofService {
    return this.zkProofService
  }
}
