import { BigNumberish } from 'ethers';

export interface ZKProof {
  proof: {
    pi_a: [BigNumberish, BigNumberish, BigNumberish];
    pi_b: [[BigNumberish, BigNumberish], [BigNumberish, BigNumberish], [BigNumberish, BigNumberish]];
    pi_c: [BigNumberish, BigNumberish, BigNumberish];
    protocol: string;
    curve: string;
  };
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

export interface EdDSASignature {
  R8: { x: BigNumberish; y: BigNumberish };
  S: BigNumberish;
}

export interface EdDSAKeyPair {
  publicKey: { x: BigNumberish; y: BigNumberish };
  privateKey: Buffer;
}

export interface ZKVerificationResult {
  verified: boolean;
  publicSignals?: Record<string, string>;
  error?: string;
}

export interface AgeProofResult extends ZKVerificationResult {
  isAdult: boolean;
  ageVerified: boolean;
}

export interface HumanityProofResult extends ZKVerificationResult {
  address: string;
  humanVerified: boolean;
}

export interface ZKConfig {
  wasmPath?: string;
  zkeyPath?: string;
  verificationKey?: any;
  enableAgeProof?: boolean;
}
