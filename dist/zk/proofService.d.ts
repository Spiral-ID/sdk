import { BigNumberish } from 'ethers';
export interface ZKProof {
    proof: any;
    publicSignals: string[];
}
export interface ProofGenerationOptions {
    messageHash: BigNumberish;
    pubKeyX: BigNumberish;
    pubKeyY: BigNumberish;
    R8x: BigNumberish;
    R8y: BigNumberish;
    S: BigNumberish;
    age?: BigNumberish;
    currentYear?: BigNumberish;
    birthYear?: BigNumberish;
}
export declare class ZKProofService {
    private wasmPath;
    private zkeyPath;
    private vkey;
    constructor(wasmPath?: string, zkeyPath?: string);
    initialize(): Promise<void>;
    generateProof(inputs: ProofGenerationOptions): Promise<ZKProof>;
    verifyProof(proof: ZKProof): Promise<boolean>;
    generateHumanityProof(messageHash: BigNumberish, pubKeyX: BigNumberish, pubKeyY: BigNumberish, R8x: BigNumberish, R8y: BigNumberish, S: BigNumberish): Promise<ZKProof>;
    generateAgeProof(messageHash: BigNumberish, pubKeyX: BigNumberish, pubKeyY: BigNumberish, R8x: BigNumberish, R8y: BigNumberish, S: BigNumberish, age: BigNumberish, currentYear: BigNumberish, birthYear: BigNumberish): Promise<ZKProof>;
    private formatInputs;
    static mimcHash(data: BigNumberish[]): string;
    static generateMessageHash(message: string): string;
}
