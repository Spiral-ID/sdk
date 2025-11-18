import * as snarkjs from 'snarkjs';
import * as circomlib from 'circomlib';
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

export class ZKProofService {
  private wasmPath: string;
  private zkeyPath: string;
  private vkey: any;

  constructor(
    wasmPath: string = './circuits/proof_of_humanity.wasm',
    zkeyPath: string = './circuits/proof_of_humanity.zkey'
  ) {
    this.wasmPath = wasmPath;
    this.zkeyPath = zkeyPath;
  }

  async initialize(): Promise<void> {
    // Carregar chave de verificação
    this.vkey = await snarkjs.zKey.exportVerificationKey(this.zkeyPath);
  }

  async generateProof(inputs: ProofGenerationOptions): Promise<ZKProof> {
    const { proof, publicSignals } = await snarkjs.groth16.fullProve(
      this.formatInputs(inputs),
      this.wasmPath,
      this.zkeyPath
    );

    return { proof, publicSignals };
  }

  async verifyProof(proof: ZKProof): Promise<boolean> {
    return await snarkjs.groth16.verify(
      this.vkey,
      proof.publicSignals,
      proof.proof
    );
  }

  async generateHumanityProof(
    messageHash: BigNumberish,
    pubKeyX: BigNumberish,
    pubKeyY: BigNumberish,
    R8x: BigNumberish,
    R8y: BigNumberish,
    S: BigNumberish
  ): Promise<ZKProof> {
    const inputs: ProofGenerationOptions = {
      messageHash,
      pubKeyX,
      pubKeyY,
      R8x,
      R8y,
      S
    };

    return this.generateProof(inputs);
  }

  async generateAgeProof(
    messageHash: BigNumberish,
    pubKeyX: BigNumberish,
    pubKeyY: BigNumberish,
    R8x: BigNumberish,
    R8y: BigNumberish,
    S: BigNumberish,
    age: BigNumberish,
    currentYear: BigNumberish,
    birthYear: BigNumberish
  ): Promise<ZKProof> {
    const inputs: ProofGenerationOptions = {
      messageHash,
      pubKeyX,
      pubKeyY,
      R8x,
      R8y,
      S,
      age,
      currentYear,
      birthYear
    };

    return this.generateProof(inputs);
  }

  private formatInputs(inputs: ProofGenerationOptions): any {
    return {
      messageHash: inputs.messageHash.toString(),
      pubKeyX: inputs.pubKeyX.toString(),
      pubKeyY: inputs.pubKeyY.toString(),
      R8x: inputs.R8x.toString(),
      R8y: inputs.R8y.toString(),
      S: inputs.S.toString(),
      age: inputs.age?.toString() || '0',
      currentYear: inputs.currentYear?.toString() || '0',
      birthYear: inputs.birthYear?.toString() || '0'
    };
  }

  // Utilitários para gerar hashes MiMC (compatível com Circom)
  static mimcHash(data: BigNumberish[]): string {
    const mimc = circomlib.mimc7;
    let hash = mimc.multiHash(data.map(d => BigInt(d.toString())));
    // For MiMC7, we need to use a different approach since mimc7 doesn't have F property
    return hash.toString();
  }

  static generateMessageHash(message: string): string {
    const encoder = new TextEncoder();
    const messageBytes = encoder.encode(message);
    
    // Converter para array de bigints para MiMC
    const chunks = [];
    for (let i = 0; i < messageBytes.length; i += 31) {
      let chunk = 0n;
      for (let j = 0; j < 31 && i + j < messageBytes.length; j++) {
        chunk = (chunk << 8n) | BigInt(messageBytes[i + j]);
      }
      chunks.push(chunk);
    }
    
    return ZKProofService.mimcHash(chunks);
  }
}