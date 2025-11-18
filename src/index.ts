import { SPIDContract } from './contracts/spid'
import { Web3Auth } from './auth/web3'
import { SpiralApiClient } from './api/client'
import { ZKProofService, SignatureUtils } from './zk'

export { SPIDContract } from './contracts/spid'
export { Web3Auth } from './auth/web3'
export { SpiralApiClient } from './api/client'
export { ZKProofService, SignatureUtils } from './zk'
export * from './types'
export * from './zk/types'

export class SpiralSDK {
  public contracts: {
    spid: SPIDContract
  }
  
  public auth: {
    web3: Web3Auth
  }
  
  public api: SpiralApiClient
  
  public zk: {
    proofService: ZKProofService
    signatureUtils: typeof SignatureUtils
  }

  constructor(config: any = {}) {
    this.contracts = {
      spid: new SPIDContract(config),
    }
    
    this.auth = {
      web3: new Web3Auth(config),
    }
    
    this.api = new SpiralApiClient(config.apiUrl)
    
    this.zk = {
      proofService: new ZKProofService(config.zkWasmPath, config.zkZkeyPath),
      signatureUtils: SignatureUtils
    }
  }

  setAuthToken(token: string): void {
    this.api.setAuthToken(token)
  }

  // Métodos ZK simplificados para facilitar o uso
  async generateZKProof(message: string, signature: any, publicKey: any): Promise<any> {
    const inputs = this.zk.signatureUtils.prepareZKInputs(message, signature, publicKey);
    return await this.zk.proofService.generateProof(inputs);
  }

  async verifyZKProof(proof: any): Promise<boolean> {
    return await this.zk.proofService.verifyProof(proof);
  }
}
