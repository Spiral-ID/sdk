import { AuthResponse, SpiralIDConfig } from '../types';
import { ZKProofService } from '../zk/proofService';
export declare class Web3Auth {
    private config;
    private walletClient;
    private zkProofService;
    constructor(config?: SpiralIDConfig);
    connectWallet(): Promise<string>;
    signMessage(message: string): Promise<string>;
    generateNonce(address: string): Promise<string>;
    authenticate(): Promise<AuthResponse>;
    authenticateWithZKProof(): Promise<AuthResponse>;
    generateZKProof(message: string, signature: string, publicKey: string): Promise<any>;
    verifyZKProof(proof: any): Promise<boolean>;
    getZKProofService(): ZKProofService;
}
