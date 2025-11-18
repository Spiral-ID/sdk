import { SPIDContract } from './contracts/spid';
import { Web3Auth } from './auth/web3';
import { SpiralApiClient } from './api/client';
import { ZKProofService, SignatureUtils } from './zk';
export { SPIDContract } from './contracts/spid';
export { Web3Auth } from './auth/web3';
export { SpiralApiClient } from './api/client';
export { ZKProofService, SignatureUtils } from './zk';
export * from './types';
export * from './zk/types';
export declare class SpiralSDK {
    contracts: {
        spid: SPIDContract;
    };
    auth: {
        web3: Web3Auth;
    };
    api: SpiralApiClient;
    zk: {
        proofService: ZKProofService;
        signatureUtils: typeof SignatureUtils;
    };
    constructor(config?: any);
    setAuthToken(token: string): void;
    generateZKProof(message: string, signature: any, publicKey: any): Promise<any>;
    verifyZKProof(proof: any): Promise<boolean>;
}
